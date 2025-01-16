const { getAvailability, reservar, lookBooking } = require('./booking');
const { sendEmail, sendCalendar } = require('./google.js');
const { generateHash, paymentReceiver } = require('./payments.js');
const { facturaFinal, facturaManual } = require('./dreadblue.js');
const { deleteBooking, createDatabase, adminBookings, createRequest, fetchRequests, manageChangeRequest } = require('./admin.js');

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
  adminBookings,
  createRequest,
  lookBooking,
  fetchRequests,
  manageChangeRequest,
};
