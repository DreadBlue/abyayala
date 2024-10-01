import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getDocs,
  collection,
  where,
  query,
  orderBy,
  setDoc,
  doc,
  limit,
  startAfter,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '/firebase/firebase.config.js';
import { getFunctions, httpsCallable } from 'firebase/functions';

export const useBookingStore = defineStore('booking', {
  state: () => {
    return {
      nombre: '',
      celular: '',
      correo: '',
      cedula: '',
      acompanantes: 0,
      infoAcompanantes: '',
      checkIn: '',
      checkOut: '',
      cabana: '',
      amountRooms: 0,
      bookingRange: [],
      precio: 0,
      idReserva: 0,
      disponibilidad: {
        Safari: 0,
        Ancestral: 0,
        AncestralDos: 0,
      },
      fetchError: false,
      currentPath: '',
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

    async datesManagement(dates) {
      if (!dates.checkIn || !dates.checkOut) {
        return navigateTo('/');
      } else if (dates.checkIn && dates.checkOut) {
        this.updateDetails(dates);
        dayjs.extend(customParseFormat);
        let checkIn = dayjs(dates.checkIn, 'DD-MM-YYYY');
        const checkOut = dayjs(dates.checkOut, 'DD-MM-YYYY');
        this.bookingRange = [];
  
        while (checkIn.isBefore(checkOut)) {
          this.bookingRange.push(checkIn.format('YYYY-MM-DD'));
          checkIn = checkIn.add(1, 'day');
        }
  
        const reservadasCollection = query(
          collection(db, 'reservadas'),
          where('fecha', 'in', this.bookingRange),
        );
  
        try {
          const querySnapshot = await getDocs(reservadasCollection);
          const docs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          for (const cabana in this.disponibilidad) {
            let ocurrences = {};
            for (const reserva of docs) {
              if (reserva.cabaña == cabana) {
                if (!ocurrences[reserva.fecha]) {
                  ocurrences[reserva.fecha] = 1;
                } else {
                  ocurrences[reserva.fecha]++;
                }
              }
            }
            for (const fecha in ocurrences) {
              if (ocurrences[fecha] > this.disponibilidad[cabana]) {
                this.disponibilidad[cabana] = ocurrences[fecha];
              }
            }
          }
        } catch (error) {
          console.error('Error fetching documents: ', error);
        }
      }
    },

    async lookBooking(booking) {
      try {
        const reservaDB = query(
          collection(db, 'reservas'),
          where('idReserva', '==', parseInt(booking[0])),
          where('Correo', '==', booking[1]),
        );
        let snapshot = await getDocs(reservaDB);
        if (snapshot.docs.length == 0) {
          return 'wrong information';
        } else if (!snapshot.docs.length == 0) {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return docs;
        }
      } catch (error) {
        console.log('error fetching booking: ', error);
        throw error;
      }
    },
    async adminBookings(filters) {
      try {
        const reservaDB = query(
          collection(db, 'reservas'),
          where('Check in', '>=', filters.value.startDate),
          orderBy('Check in', 'desc'),
        );
        let snapshot = await getDocs(reservaDB);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.lastBooking = docs[docs.length - 1]['Check in'];
        return docs;
      } catch (error) {
        console.log('error fetching booking: ', error);
        throw error;
      }
    },

    async reservar(item) {
      const reservadasCollection = query(
        collection(db, 'reservadas'),
        where('fecha', 'in', this.bookingRange),
        where('cabaña', '==', this.cabana),
      );

      try {
        const querySnapshot = await getDocs(reservadasCollection);
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

          let ocurrences = {};
          for (const reserva of docs) {
            if (!ocurrences[reserva.fecha]) {
              ocurrences[reserva.fecha] = 1;
            } else {
              ocurrences[reserva.fecha]++;
            }
          }
          let ocupadas = 0;
          for (const fecha in ocurrences) {
            if (ocurrences[fecha] > ocupadas) {
              ocupadas = ocurrences[fecha];
            }
          }
          console.log('ocupadas', ocupadas);
          const makeReservation = async () => {
            try {
              const reservaDB = query(
                collection(db, 'reservas'),
                orderBy('timestamp', 'desc'),
                limit(1),
              );
              let snapshot = await getDocs(reservaDB);
              const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
      
              const idReserva = docs[0].idReserva + 1;
              const storage = getStorage();
              const archivoRef = ref(storage, `Comprobantes/ABYA${idReserva}`);
      
              const uploadInvoice = await uploadBytes(archivoRef, item.invoice[0]);
              console.log('Archivo subido con éxito', uploadInvoice);
      
              const url = await getDownloadURL(archivoRef);
      
              await setDoc(doc(db, 'reservas', `ABYA${idReserva}`), {
                idReserva: idReserva,
                Nombre: item.nombre,
                Celular: item.celular,
                Correo: item.correo,
                Cédula: item.cedula,
                'Cantidad de cabañas': this.amountRooms,
                'Cantidad de huespedes': item.acompanantes,
                'Check in': dayjs(this.checkIn, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                'Check out': dayjs(this.checkOut, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                'Información de acompañantes': item.infoAcompanantes,
                Valor: this.precio,
                'Tipo de cabaña': this.cabana,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                urlInvoice: url,
              });
      
              this.idReserva = idReserva;
      
              let numCabanas = this.amountRooms;
              while (numCabanas > 0) {
                let noches = 1;
                for (const element of this.bookingRange) {
                  await setDoc(
                    doc(
                      db,
                      'reservadas',
                      `${idReserva + numCabanas.toString() + noches.toString()}`,
                    ),
                    {
                      cabaña: this.cabana,
                      fecha: element,
                    },
                  );
                  noches++;
                }
                numCabanas = numCabanas - 1;
              }
            } catch (error) {
              console.log('error fetching booking: ', error);
              throw error;
            }
          }

          if (this.cabana == 'Safari' && this.amountRooms <= 8 - ocupadas) {
            makeReservation()
          } else if (this.cabana == 'Ancestral' && this.amountRooms <= 1 - ocupadas) {
            makeReservation()
          } else if (this.cabana == 'Ancestral Dos' && this.amountRooms <= 1 - ocupadas) {
            makeReservation()
          };
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    },

    async fetchGoogle(item, emailF, eventF) {
      const reservaDB = query(
        collection(db, 'reservas'),
        orderBy('timestamp', 'desc'),
        limit(1),
      );
      let snapshot = await getDocs(reservaDB);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const idReserva = docs[0].idReserva;

      if (emailF == true) {
        try {
          const infoEmail = {
            Nombre: item.nombre,
            BookingRooms: this.amountRooms,
            Correo: item.correo,
            NumeroAcompanantes: item.acompanantes,
            CheckInDate: this.checkIn,
            CheckOutDate: this.checkOut,
            PrecioCabana: this.precio,
            TipoDeCabaña: this.cabana,
            subject: 'Confirmación de reserva',
            idReserva: `ABYA${idReserva}`,
          };

          const functions = getFunctions();
          const sendEmail = httpsCallable(functions, 'sendEmail');
          const email = await sendEmail({ infoEmail, secret: 'SendThisEmail' });
        } catch (error) {
          console.log('error fetching email: ', error);
          throw error;
        }
      }

      if (eventF == true) {
        try {
          let description = `https://www.abyayalahostel.com/reserva-${idReserva}/${item.correo}`;
          const infoEvent = {
            RangeDates: this.bookingRange,
            BookingRooms: this.amountRooms,
            Nombre: item.nombre,
            TipoDeCabaña: this.cabana,
            PrecioCabana: this.precio,
            description,
            secret: 'SendThisEvent',
          };
          const functions = getFunctions();
          const sendCalendar = httpsCallable(functions, 'sendCalendar');
          console.log('request', sendCalendar.data);
          const event = await sendCalendar({ infoEvent });
        } catch (error) {
          console.log('error fetching event: ', error);
          throw error;
        }
      }
    },

    async cargarReservas() {
      try {
        const reservaDB = query(
          collection(db, 'reservas'),
          orderBy('Check in', 'desc'),
          startAfter(this.lastBooking),
          limit(10),
        );
        let snapshot = await getDocs(reservaDB);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.lastBooking = docs[docs.length - 1]['Check in'];

        return docs;
      } catch (error) {
        console.log('Más reservas error: ', error);
      }
    },

    async downloadBill(url) {
      try {
        const storage = getStorage();
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = (event) => {
          const blob = xhr.response;
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'comprobante.ext';
          link.click();
        };
        xhr.open('GET', url);
        xhr.send();
      } catch (error) {
        console.log('Error al descargar: ', error);
      }
    },

    async deleteBooking(reserva, reservadas) {
      try {
        await deleteDoc(doc(db, reserva[0], reserva[1]));
        for (const element of reservadas[1]) {
          await deleteDoc(doc(db, reservadas[0], element));
        }
      } catch (error) {
        console.log('Error al borrar: ', error);
      }
    },
  },
});
