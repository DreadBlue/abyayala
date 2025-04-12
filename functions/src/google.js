const {
  log,
  // info,
  // debug,
  // warn,
  error,
  // write,
} = require('firebase-functions/logger');
const { onCall } = require('firebase-functions/v2/https');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { google } = require('googleapis');
const { db } = require('./firebase');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const htmlTemplate = fs.readFileSync('emailTemplate.html', 'utf-8');
const BillTemplate = fs.readFileSync('billTemplate.html', 'utf-8');
const secretEmail = process.env.SECRET_EMAIL;

const sendBillEmail = (data) => {
  if (data.secret !== secretEmail) return 'Missing secret';
  let correoHtml = BillTemplate;

  correoHtml = correoHtml.replace('{{mes}}', data.mes);
  correoHtml = correoHtml.replace('{{aliado}}', data.aliado);
  correoHtml = correoHtml.replace(
    '{{numeroDeReservas}}',
    data.numeroDeReservas,
  );
  correoHtml = correoHtml.replace('{{ventasTotales}}', data.ventasTotales);
  correoHtml = correoHtml.replace('{{comision}}', data.comision);
  correoHtml = correoHtml.replace('{{valorFactura}}', data.billValue);

  // Datos del correo
  const mailOptions = {
    to: 'reservas.abyayalahostel@gmail.com',
    bcc: 'desarrollo@dreadblue.com',
    subject: `Factura de comisión de ${data.mes}`,
    html: correoHtml,
    headers: {
      'Content-Type': 'text/html',
    },
  };
  return transporter
    .sendMail(mailOptions)
    .then((r) => {
      log('Correo enviado con éxito');
      log('Correo enviado:', r.accepted);
      return { success: 'Correo enviado' };
    })
    .catch((e) => {
      log('error en sendEmail');
      console.error('Error al enviar correo:', e);
      throw new Error('Error al enviar correo');
    });
};

const sendBookEmail = (data) => {
  const secretEmail = process.env.SECRET_EMAIL;
  if (data.secret !== secretEmail) return log('Wrong secret');
  let correoHtml = htmlTemplate;

  correoHtml = correoHtml.replace('{{nombre}}', data.Nombre);
  correoHtml = correoHtml.replace('{{idReserva}}', data.idReserva);
  correoHtml = correoHtml.replace('{{cabana}}', data.TipoDeCabaña);
  correoHtml = correoHtml.replace('{{checkIn}}', data.CheckInDate);
  correoHtml = correoHtml.replace('{{checkOut}}', data.CheckOutDate);
  correoHtml = correoHtml.replace('{{cantidadCabañas}}', data.BookingRooms);

  // Datos del correo
  const mailOptions = {
    to: data.Correo,
    // bcc: 'reservas.abyayalahostel@gmail.com',
    subject: data.subject,
    html: correoHtml,
    headers: {
      'Content-Type': 'text/html',
    },
  };
  return transporter
    .sendMail(mailOptions)
    .then((r) => {
      log('Correo enviado con éxito');
      log('Correo enviado:', r.accepted);
      return { success: 'Correo enviado' };
    })
    .catch((e) => {
      log('error en sendEmail');
      console.error('Error al enviar correo:', e);
      throw new Error('Error al enviar correo');
    });
};

const sendEmail = onCall((request) => {
  try {
    const data = request.data;
    return sendBookEmail(data);
  } catch (e) {
    log('catch', e);
    return error(e);
  }
});

const addCalendar = async (data) => {
  const reservasCollection = db.collection('reservas');
  const clientEmail = process.env.CLIENT_EMAIL;
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  const secretCalendar = process.env.SECRET_CALENDAR;
  try {
    const eventIds = [];

    // Autenticación utilizando la clave de la cuenta de servicio
    const auth = new google.auth.JWT(clientEmail, null, privateKey, [
      'https://www.googleapis.com/auth/calendar',
    ]);
    auth.authorize((err, tokens) => {
      if (err) {
        console.log('Error al autorizar:', err);
        return;
      }

      log('auth', auth);
      // Crear un cliente de API de Google Calendar
      const calendar = google.calendar({ version: 'v3', auth });
      if (data.secret !== secretCalendar) {
        return 'Missing secret';
      }

      const RangeDates = data.RangeDates;
      for (const date of RangeDates) {
        // Detalles del evento
        const event = {
          summary: `${data.BookingRooms} ${data.TipoDeCabaña} ${data.Nombre}`,
          description: data.description,
          start: {
            date: date,
            timeZone: 'America/Bogota',
          },
          end: {
            date: date,
            timeZone: 'America/Bogota',
          },
        };

        // Crear el evento utilizando la cuenta de servicio
        calendar.events.insert(
          {
            auth: auth,
            calendarId:
              '52ea7246fbd18a9ae98f0fbc0bb905e001158af36ef25564ccfcc772a5dc08d7@group.calendar.google.com', // Cambia a la ID de calendario deseada
            resource: event,
          },
          (err, result) => {
            if (err) {
              console.error('Error al crear el evento:', err);
              return;
            }
            eventIds.push(result.data.id);
            reservasCollection
              .doc(data.idReserva)
              .update({ 'calendarIds': eventIds });
            log('Evento creado:', result.data);
          },
        );
      }
    });
    log('Eventos creados con éxito');
  } catch (e) {
    log('catch', e);
    return error(e);
  }
};

const deleteCalendarEvent = async (data) => {
  log('data', data);
  const clientEmail = process.env.CLIENT_EMAIL;
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  try {
    // Autenticación utilizando la clave de la cuenta de servicio
    const auth = new google.auth.JWT(clientEmail, null, privateKey, [
      'https://www.googleapis.com/auth/calendar',
    ]);

    auth.authorize((err) => {
      if (err) {
        console.log('Error al autorizar:', err);
        return;
      }

      // Crear un cliente de API de Google Calendar
      const calendar = google.calendar({ version: 'v3', auth });

      for (const id of data.calendarIds) {
        calendar.events.delete(
          {
            calendarId:
              '52ea7246fbd18a9ae98f0fbc0bb905e001158af36ef25564ccfcc772a5dc08d7@group.calendar.google.com', // Cambia a la ID de calendario deseada
            eventId: id,
          },
          (err) => {
            if (err) {
              console.error('Error al eliminar el evento:', err);
              return;
            }
            console.log('Evento eliminado con éxito:', id);
          },
        );
      }
    });
  } catch (e) {
    console.error('Error en el catch:', e);
    return error(e);
  }
};

const sendCalendar = onCall((request) => {
  try {
    const data = request.data.infoEvent;
    return addCalendar(data);
  } catch (e) {
    log('catch', e);
    return error(e);
  }
});

module.exports = {
  addCalendar,
  sendCalendar,
  sendEmail,
  sendBookEmail,
  sendBillEmail,
  deleteCalendarEvent,
};
