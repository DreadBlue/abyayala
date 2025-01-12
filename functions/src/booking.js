const {
  log,
  // info,
  // debug,
  // warn,
  // error,
  // write,
} = require('firebase-functions/logger');
const { onCall } = require('firebase-functions/v2/https');
const { FieldValue } = require('firebase-admin/firestore');
const { formValidations } = require('./middlewares.js');
const { sendBookEmail, addCalendar } = require('./google.js');
const dayjs = require('dayjs');
const { db, bucket } = require('./firebase');

const getAvailability = onCall(async (request) => {
  const data = request.data;
  const availabilityCollection = db.collection('availability');
  const disponibilidad = {
    Safari: 8,
    Ancestral: 1,
    Anamay: 1,
  };
  const bookingRange = [];

  let checkIn = dayjs(data.dates.checkIn, 'YYYY-MM-DD');
  const checkOut = dayjs(data.dates.checkOut, 'YYYY-MM-DD');

  while (checkIn.isBefore(checkOut)) {
    bookingRange.push(checkIn.format('YYYY-MM-DD'));
    checkIn = checkIn.add(1, 'day');
  }

  const availabilityQuery = await availabilityCollection.where(
    'date',
    'in',
    bookingRange,
  );

  try {
    const availabilitySnapshot = await availabilityQuery.get();
    const docs = availabilitySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (const doc of docs) {
      if (doc.room_id == 'safari' && doc.spots < disponibilidad.Safari) {
        disponibilidad.Safari = doc.spots;
      }
      if (doc.room_id == 'ancestral' && doc.spots < disponibilidad.Ancestral) {
        disponibilidad.Ancestral = doc.spots;
      }
      if (doc.room_id == 'anamay' && doc.spots < disponibilidad.Anamay) {
        disponibilidad.Anamay = doc.spots;
      }
    }
    return { disponibilidad, bookingRange };
  } catch (error) {
    console.error(error);
    return error;
  }
});

const generateBookingCode = async () => {
  const caracteres = 'ABY0123456789';
  let codigo = '';
  let uniqueCode = false;

  for (let i = 0; i < 6; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres[indiceAleatorio];
  }

  while (uniqueCode == false) {
    const checkingCode = db
      .collection('reservas')
      .where('idReserva', '==', codigo);
    const snapshot = await checkingCode.get();
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (docs.length == 0) {
      uniqueCode = true;
    }
  }

  return codigo;
};

const verifyAvailability = async (info) => {
  const availabilityCollection = db.collection('availability');
  const availabilityQuery = availabilityCollection
    .where('date', 'in', info.bookingRange)
    .where('room_id', '==', info.cabana);

  try {
    const availabilitySnapshot = await availabilityQuery.get();
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
};

const takeAvailability = async (item) => {
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
        spots: FieldValue.increment(-item.amountRooms),
      });
    }
  } catch (error) {
    console.error(error);
  }
};


const reservar = onCall(async (request) => {
  const item = request.data.bookingInfo;
  const inputsVerification = await formValidations(item);
  if (inputsVerification == false) {
    return 'Error en los datos ingresados';
  }
  const idReserva = await generateBookingCode();
  const url = 'aun no se ha generado';
  const availabilityVerification = await verifyAvailability(item);
  if (availabilityVerification == false) {
    return 'No hay disponibilidad';
  }
  const reservasCollection = db.collection('reservas');

  try {
    if (item.fileData) {
      const buffer = Buffer.from(item.fileData, 'base64');
      const file = bucket.file(`comprobantes/${idReserva}`);
      await file.save(buffer, {
        contentType: item.fileType,
        public: false,
      });
    }
    log('Comprobante subido con éxito');

    await reservasCollection.doc(idReserva).set({
      'idReserva': idReserva,
      'Nombre': item.nombre,
      'Celular': item.celular,
      'Correo': item.correo,
      'Cédula': item.cedula,
      'Cantidad de cabañas': item.amountRooms,
      'Cantidad de huespedes': item.acompanantes,
      'Check in': item.checkIn,
      'Check out': item.checkOut,
      'Información de acompañantes': item.infoAcompanantes,
      'Valor': item.precio,
      'Tipo de cabaña': item.cabana,
      'timestamp': dayjs().format('YYYY-MM-DD HH:mm:ss'),
      'urlInvoice': url,
      'status': 'pending',
    });
    log('Reserva creada con éxito');
    await takeAvailability(item);
    log('Disponibilidad actualizada');
    const secretEmail = process.env.SECRET_EMAIL;
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
      idReserva: idReserva,
      secret: secretEmail,
    };
    sendBookEmail(infoEmail);
    const secretCalendar = process.env.SECRET_CALENDAR;
    const description = `https://www.abyayalahostel.com/reserva-${item.idReserva}/${item.correo}`;
    const infoEvent = {
      RangeDates: item.bookingRange,
      BookingRooms: item.amountRooms,
      Nombre: item.nombre,
      TipoDeCabaña: item.cabana,
      PrecioCabana: item.precio,
      description,
      idReserva: idReserva,
      secret: secretCalendar,
    };
    addCalendar(infoEvent);
    return idReserva;
  } catch (error) {
    console.error('Error fetching reserva: ', error);
  }
});

module.exports = {
  getAvailability,
  reservar,
};
