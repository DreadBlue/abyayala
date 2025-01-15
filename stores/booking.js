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
  increment,
  limit,
  updateDoc,
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
      precioActivities: 0,
      precioMenu: 0,
      torrentismo: 0,
      canopy: 0,
      rafting: 0,
      menu: [],
      idReserva: 'ABY000',
      fetchError: false,
      currentPath: '',
      lastBooking: 0,
    };
  },
  persist: {
    storage: sessionStorage,
    pick: ['idReserva'],
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

    async getAvailability(dates) {
      try {
        const functions = getFunctions();
        const availabilityFunction = httpsCallable(
          functions,
          'getAvailability',
        );
        const availability = await availabilityFunction({ dates });
        this.bookingRange = availability.data.bookingRange;
        return availability.data.disponibilidad;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async reservar(item) {
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      let bookingInfo = {};
      if (item.invoice.name) {
        const base64File = await fileToBase64(item.invoice);
        const precioFinal = this.precio + this.precioActivities + this.precioMenu;
        bookingInfo = {
          ...item,
          fileName: item.invoice.name,
          fileType: item.invoice.type,
          fileData: base64File,
          amountRooms: this.amountRooms,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          precio: this.precio,
          cabana: this.cabana,
          bookingRange: this.bookingRange,
          torrentismo: this.torrentismo,
          canopy: this.canopy,
          rafting: this.rafting,
          menu: this.menu,
          precioMenu: this.precioMenu,
          precioActividades: this.precioActivities,
          precioFinal: precioFinal,
          status: 'pending',
        };
      } else {
        bookingInfo = {
          ...item,
          amountRooms: this.amountRooms,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          precio: this.precio,
          cabana: this.cabana,
          bookingRange: this.bookingRange,
          torrentismo: this.torrentismo,
          canopy: this.canopy,
          rafting: this.rafting,
          menu: this.menu,
          precioMenu: this.precioMenu,
          precioActividades: this.precioActivities,
          precioFinal: precioFinal,
          status: 'pending',
        };
      }
      console.log('bookingInfo: ', bookingInfo);

      try {
        const functions = getFunctions();
        const reservarEvent = httpsCallable(functions, 'reservar');
        const reservar = await reservarEvent({ bookingInfo });
        this.idReserva = reservar.data;
        return reservar.data;
      } catch (error) {
        console.error('Error creando reserva: ', error);
      }
    },

    async fetchGoogle(emailF, eventF, item) {
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
            subject: 'Confirmación de reserva',
            idReserva: item.idReserva,
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
          let description = `https://www.abyayalahostel.com/reserva-${item.idReserva}/${item.correo}`;
          const infoEvent = {
            RangeDates: item.bookingRange,
            BookingRooms: item.amountRooms,
            Nombre: item.nombre,
            TipoDeCabaña: item.cabana,
            PrecioCabana: item.precio,
            description,
            secret: 'SendThisEvent',
          };
          const functions = getFunctions();
          const sendCalendar = httpsCallable(functions, 'sendCalendar');
          const event = await sendCalendar({ infoEvent });

          return item.idReserva;
        } catch (error) {
          console.log('error fetching event: ', error);
          throw error;
        }
      }
    },
  },
});
