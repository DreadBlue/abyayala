const { onCall } = require('firebase-functions/v2/https');
const { FieldValue } = require('firebase-admin/firestore');
const { deleteCalendarEvent } = require('./google');
const db = require('./firebase');
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

const retakeAvailability = async (item) => {
  const availabilityCollection = db.collection('availability');
  const availabilityQuery = availabilityCollection
    .where('date', 'in', item.bookingRange)
    .where('room_id', '==', item.cabana.toLowerCase());

  try {
    const availabilitySnapshot = await availabilityQuery.get();
    const docs = availabilitySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    for (const document of docs) {
      const docRef = availabilityCollection.doc(document.id);
      await docRef.update({
        spots: FieldValue.increment(item.amountRooms),
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteBooking = onCall(async (request) => {
  const data = request.data;
  const bookingRef = db.collection('reservas').doc(data.bookingId);

  const bookingRange = [];

  let checkIn = dayjs(data.dates.checkIn, 'YYYY-MM-DD');
  const checkOut = dayjs(data.dates.checkOut, 'YYYY-MM-DD');

  while (checkIn.isBefore(checkOut)) {
    bookingRange.push(checkIn.format('YYYY-MM-DD'));
    checkIn = checkIn.add(1, 'day');
  }

  await retakeAvailability({ data, bookingRange });
  await bookingRef.delete();
  await deleteCalendarEvent({ data, bookingRange });
});

module.exports = { createDatabase, deleteBooking };
