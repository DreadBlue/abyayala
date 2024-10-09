import { defineStore } from 'pinia';
import {
  getDocs,
  collection,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "/firebase/firebase.config.js";

export const useAdminStore = defineStore('admin', {
  state: () => {
    return {
      showPreview: false,
    };
  },
  actions: {
    async lookBooking(booking) {
      try {
        const reservaDB = query(
          collection(db, "reservas"),
          where("idReserva", "==", booking[0]),
          where("Correo", "==", booking[1])
        );
        let snapshot = await getDocs(reservaDB);
        if (snapshot.docs.length == 0) {
          return "wrong information";
        } else if (!snapshot.docs.length == 0) {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return docs;
        }
      } catch (error) {
        console.log("error fetching booking: ", error);
        throw error;
      }
    },

    async adminBookings(filters) {
      try {
        const reservaDB = query(
          collection(db, "reservas"),
          where("Check in", ">=", filters.startDate),
          orderBy("Check in", "desc")
        );
        let snapshot = await getDocs(reservaDB);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.lastBooking = docs[docs.length - 1]["Check in"];
        return docs;
      } catch (error) {
        console.log("error fetching booking: ", error);
        throw error;
      }
    },

    async cargarReservas() {
      try {
        const reservaDB = query(
          collection(db, "reservas"),
          orderBy("Check in", "desc"),
          startAfter(this.lastBooking),
          limit(10)
        );
        let snapshot = await getDocs(reservaDB);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.lastBooking = docs[docs.length - 1]["Check in"];

        return docs;
      } catch (error) {
        console.log("Más reservas error: ", error);
      }
    },
  },
});
