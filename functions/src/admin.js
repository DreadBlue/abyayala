const { onCall } = require('firebase-functions/v2/https');
const { log } = require('firebase-functions/logger');
const { FieldValue } = require('firebase-admin/firestore');
const { deleteCalendarEvent } = require('./google');
const { db } = require('./firebase');
const dayjs = require('dayjs');


const createDatabase = onCall(async (request) => {
  const availabilityCollection = db.collection('availability');
  const data = request.data;
  const start = new Date(data.start);
  const end = new Date(data.end);

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const formattedDate = date.toISOString().split('T')[0];

    await availabilityCollection
      .doc(`safari_${formattedDate}`)
      .set({ room_id: 'safari', date: formattedDate, spots: 8 });
    await availabilityCollection
      .doc(`ancestral_${formattedDate}`)
      .set({ room_id: 'ancestral', date: formattedDate, spots: 1 });
    await availabilityCollection
      .doc(`anamay_${formattedDate}`)
      .set({ room_id: 'anamay', date: formattedDate, spots: 1 });
  }
});


const adminBookings = onCall(async (request) => {
  const filters = request.data.filters;
  const activities = Object.entries(filters.activities).filter(([key, value]) => value === true).map(([key]) => key);
  const horarios = Object.entries(filters.horario).filter(([key, value]) => value === true).map(([key]) => key);
  const comida = Object.entries(filters.comida).filter(([key, value]) => value === true).map(([key]) => key);
  const transporte = Object.entries(filters.transporte).filter(([key, value]) => value === true).map(([key]) => key);
  const reservasCollection = db.collection('reservas');

  if (activities.length > 0 && horarios.length > 0 && comida.length > 0 && transporte.length > 0) {
    try {
      const reservasQuery = reservasCollection
        .where("date", "<=", filters.time.startDate)
        .where("date", ">=", filters.time.endDate)
        .where("Tipo de cabañas", "in", filters.cabanas)
        .where("actividades", "in", filters.actividades)
        .where("comida", "in", filters.comida)
        .where("pago", "in", filters.pago)
        .orderBy("date", "desc");
      const reservasSnapshot = await reservasQuery.get();
      const docs = reservasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return docs;
    } catch (error) {
      console.log("error fetching booking: ", error);
      throw error;
    }
  } else {
    return ['Faltan filtros'];
  }
});

const retakeAvailability = async (item) => {
  const availabilityCollection = db.collection('availability');
  const availabilityQuery = availabilityCollection
    .where('date', 'in', item.bookingRange)
    .where('room_id', '==', item.data['Tipo de cabaña'].toLowerCase());

  try {
    const availabilitySnapshot = await availabilityQuery.get();
    const docs = availabilitySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    for (const document of docs) {
      const docRef = availabilityCollection.doc(document.id);
      await docRef.update({
        spots: FieldValue.increment(item.data['Cantidad de cabañas']),
      });
    }
    log('Availability retaken');
  } catch (error) {
    console.error(error);
  }
};

const deleteBooking = onCall(async (request) => {
  const data = JSON.parse(request.data.item);
  const bookingRef = db.collection('reservas').doc(data.id);

  const bookingRange = [];

  let checkIn = dayjs(data['Check in'], 'YYYY-MM-DD');
  const checkOut = dayjs(data['Check out'], 'YYYY-MM-DD');

  while (checkIn.isBefore(checkOut)) {
    bookingRange.push(checkIn.format('YYYY-MM-DD'));
    checkIn = checkIn.add(1, 'day');
  }

  try {
    await retakeAvailability({ data, bookingRange });
    await bookingRef.delete();
    await deleteCalendarEvent(data);
    return 'Complete booking deleted';
  } catch (error) {
    console.error(error);
    return error;
  }
});

module.exports = { createDatabase, deleteBooking, adminBookings };
