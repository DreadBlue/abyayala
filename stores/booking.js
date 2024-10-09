import { defineStore } from "pinia";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDocs,
  collection,
  where,
  query,
  orderBy,
  setDoc,
  doc,
  increment,
  limit,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "/firebase/firebase.config.js";
import { getFunctions, httpsCallable } from "firebase/functions";

export const useBookingStore = defineStore("booking", {
  state: () => {
    return {
      nombre: "",
      celular: "",
      correo: "",
      cedula: "",
      acompanantes: 0,
      infoAcompanantes: "",
      checkIn: "",
      checkOut: "",
      cabana: "",
      amountRooms: 0,
      bookingRange: [],
      precio: 0,
      idReserva: 0,
      disponibilidad: {
        Safari: 8,
        Ancestral: 1,
        Anamay: 1,
      },
      fetchError: false,
      currentPath: "",
      lastBooking: 0,
    };
  },
  actions: {
    updateDetails(item) {
      const statesNames = Object.keys(this.$state);
      for (const data in item) {
        if (statesNames.includes(data)) {
          this.$state[data] = item[data];
        }
      }
    },

    async createDatabase() {
      const start = new Date("2024-10-08");
      const end = new Date("2025-06-30");

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const formattedDate = date.toISOString().split("T")[0];

        await setDoc(doc(db, "availability", `safari_${formattedDate}`), {
          room_id: "safari",
          date: formattedDate,
          spots: 8,
        });
        await setDoc(doc(db, "availability", `ancestral_${formattedDate}`), {
          room_id: "ancestral",
          date: formattedDate,
          spots: 1,
        });
        await setDoc(doc(db, "availability", `anamay_${formattedDate}`), {
          room_id: "anamay",
          date: formattedDate,
          spots: 1,
        });
      }
    },

    async getAvailability(dates) {
      this.bookingRange = [];
      let checkIn = dayjs(dates.checkIn, "YYYY-MM-DD");
      const checkOut = dayjs(dates.checkOut, "YYYY-MM-DD");

      while (checkIn.isBefore(checkOut)) {
        this.bookingRange.push(checkIn.format("YYYY-MM-DD"));
        checkIn = checkIn.add(1, "day");
      }

      const availabilityCollection = query(
        collection(db, "availability"),
        where("date", "in", this.bookingRange)
      );

      try {
        const availabilitySnapshot = await getDocs(availabilityCollection);
        const docs = availabilitySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (const data of docs) {
          if (
            data.room_id == "safari" &&
            data.spots < this.disponibilidad.Safari
          ) {
            this.disponibilidad.Safari = data.spots;
          }
          if (
            data.room_id == "ancestral" &&
            data.spots < this.disponibilidad.Ancestral
          ) {
            this.disponibilidad.Ancestral = data.spots;
          }
          if (
            data.room_id == "anamay" &&
            data.spots < this.disponibilidad.Anamay
          ) {
            this.disponibilidad.Anamay = data.spots;
          }
        }
        return this.disponibilidad;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async generateBookingCode() {
      const caracteres = "ABY0123456789";
      let codigo = "";
      let uniqueCode = false;

      for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[indiceAleatorio];
      }

      while (uniqueCode == false) {
        const bookingsCollection = query(
          collection(db, "reservas"),
          where("idReserva", "==", codigo)
        );
  
        const snapshot = await getDocs(bookingsCollection);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (docs.length == 0) {
          uniqueCode = true;
        };
      }

      this.idReserva = codigo;
      return codigo;
    },

    async verifyAvailability() {
      const availabilityCollection = query(
        collection(db, "availability"),
        where("date", "in", this.bookingRange),
        where("room_id", "==", this.cabana)
      );

      try {
        const availabilitySnapshot = await getDocs(availabilityCollection);
        const docs = availabilitySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let availability = true;

        for (const document of docs) {
          if (document.spots < this.amountRooms) {
            availability = false;
          }
        }

        return availability;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async takeAvailability() {
      const availabilityCollection = query(
        collection(db, "availability"),
        where("date", "in", this.bookingRange),
        where("room_id", "==", this.cabana.toLowerCase())
      );

      try {
        const availabilitySnapshot = await getDocs(availabilityCollection);
        const docs = availabilitySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (const document of docs) {
          const docRef = doc(db, "availability", document.id);
          await updateDoc(docRef, {
            spots: increment(-this.amountRooms),
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    async reservar(item) {
      const availability = await this.verifyAvailability();
      const idReserva = await this.generateBookingCode();
      const eventsInfo = {
        ...item,
        amountRooms: this.amountRooms,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        precio: this.precio,
        cabana: this.cabana,
        idReserva: idReserva,
        bookingRange: this.bookingRange,
      }
      localStorage.setItem('item', JSON.stringify(eventsInfo));
      
      try {
        if (availability == true) {
          this.fetchGoogle(true, false);
          await this.takeAvailability();

          const storage = getStorage();
          const archivoRef = ref(storage, `Comprobantes/${idReserva}`);

          const uploadInvoice = await uploadBytes(archivoRef, item.invoice[0]);
          console.log("Archivo subido con éxito", uploadInvoice);

          const url = await getDownloadURL(archivoRef);

          await setDoc(doc(db, "reservas", `${idReserva}`), {
            idReserva: idReserva,
            Nombre: item.nombre,
            Celular: item.celular,
            Correo: item.correo,
            Cédula: item.cedula,
            "Cantidad de cabañas": this.amountRooms,
            "Cantidad de huespedes": item.acompanantes,
            "Check in": this.checkIn,
            "Check out": this.checkOut,
            "Información de acompañantes": item.infoAcompanantes,
            Valor: this.precio,
            "Tipo de cabaña": this.cabana,
            timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            urlInvoice: url,
            status: "pending",
          });
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    },

    async fetchGoogle(emailF, eventF) {
      const item = JSON.parse(localStorage.getItem('item'));

      if (emailF == true) {
        try {
          const infoEmail = {
            Nombre: item.nombre,
            BookingRooms: item.amountRooms,
            Correo: item.correo,
            NumeroAcompanantes: item.acompanantes,
            CheckInDate: item.checkIn,
            CheckOutDate: item.checkOut,
            PrecioCabana: item.precio,
            TipoDeCabaña: item.cabana,
            subject: "Confirmación de reserva",
            idReserva: item.idReserva,
          };

          const functions = getFunctions();
          const sendEmail = httpsCallable(functions, "sendEmail");
          const email = await sendEmail({ infoEmail, secret: "SendThisEmail" });
        } catch (error) {
          console.log("error fetching email: ", error);
          throw error;
        }
      }

      if (eventF == true) {
        try {
          let description = `https://www.abyayalahostel.com/reserva-${item.idReserva}/${item.correo}`;
          const infoEvent = {
            RangeDates: item.bookingRange,
            BookingRooms: item.amountRooms,
            Nombre: item.nombre,
            TipoDeCabaña: item.cabana,
            PrecioCabana: item.precio,
            description,
            secret: "SendThisEvent",
          };
          const functions = getFunctions();
          const sendCalendar = httpsCallable(functions, "sendCalendar");
          const event = await sendCalendar({ infoEvent });

          return item.idReserva;
        } catch (error) {
          console.log("error fetching event: ", error);
          throw error;
        }
      }
    },

    async downloadBill(url) {
      try {
        const storage = getStorage();
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";

        xhr.onload = (event) => {
          const blob = xhr.response;
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "comprobante.ext";
          link.click();
        };
        xhr.open("GET", url);
        xhr.send();
      } catch (error) {
        console.log("Error al descargar: ", error);
      }
    },

    async deleteBooking(reserva, reservadas) {
      try {
        await deleteDoc(doc(db, reserva[0], reserva[1]));
        for (const element of reservadas[1]) {
          await deleteDoc(doc(db, reservadas[0], element));
        }
      } catch (error) {
        console.log("Error al borrar: ", error);
      }
    },
  },
});
