import { defineStore } from 'pinia';
import { httpsCallable } from 'firebase/functions';
import { functions } from "/firebase/firebase.config.js";

export const useBookingStore = defineStore('booking', {
  state: () => {
    return {
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
    resetStates() {
      this.$state.precioMenu = 0;
      this.$state.torrentismo = 0;
      this.$state.canopy = 0;
      this.$state.rafting = 0;
      this.$state.menu = [];
    },

    updateDetails(item) {
      const statesNames = Object.keys(this.$state);
      for (const data in item) {
        if (statesNames.includes(data)) {
          this.$state[data] = item[data];
        }
      }
    },

    async lookBooking(bookingInfo) {
      console.log(bookingInfo)
      try {
        const lookBookingFunction = httpsCallable(
          functions,
          'lookBooking',
        );
        const booking = await lookBookingFunction(bookingInfo);
        return booking.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    async getAvailability(dates) {
      try {
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

    async firestoreTesting() {
      try {
        const firestoreTesting = httpsCallable(
          functions,
          'firestoreTesting',
        );
        await firestoreTesting();
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
      const precioFinal = this.precio + this.precioActivities + this.precioMenu;
      if (item.invoice.name) {
        const base64File = await fileToBase64(item.invoice);
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
        };
      }

      try {
        const reservarEvent = httpsCallable(functions, 'reservar');
        const reservar = await reservarEvent(bookingInfo);
        this.idReserva = reservar.data;
        return reservar.data;
      } catch (error) {
        console.error('Error creando reserva: ', error);
      }
    },

    async sendEmail(item) {
      console.log(item)
      // try {
      //   const sendEmail = httpsCallable(functions, 'sendEmail');
      //   const email = await sendEmail(item);
      //   return email;
      // } catch (error) {
      //   console.log('error fetching email: ', error);
      //   throw error;
      // }
    },

    async changeRequest(item) {
      console.log(item)
      try {
        const sendChangeRequest = httpsCallable(functions, 'createRequest');
        const changeRequest = await sendChangeRequest(item);
        return changeRequest;
      } catch (error) {
        console.log('error sending request: ', error);
        throw error;
      }
    },

  },
});
