const { getAvailability, reservar } = require('./booking');
const { sendEmail, sendCalendar } = require('./google.js');
const { generateHash, paymentReceiver } = require('./payments.js');
const { facturaFinal, facturaManual } = require('./dreadblue.js');
const { deleteBooking, createDatabase } = require('./admin.js');

module.exports = {
  sendEmail,
  generateHash,
  sendCalendar,
  paymentReceiver,
  getAvailability,
  reservar,
  facturaFinal,
  facturaManual,
  deleteBooking,
  createDatabase,
};
