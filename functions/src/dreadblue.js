const { onSchedule } = require("firebase-functions/v2/scheduler");
const { db } = require("./firebase");
const { onCall } = require("firebase-functions/v2/https");
const { sendBillEmail } = require("./google");

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (01-12)
    const day = String(date.getDate()).padStart(2, '0'); // Día (01-31)

    return `${year}-${month}-${day}`;
};

const facturaFinal = onSchedule("59 23 28-31 * *", async () => {
    const currentDate = new Date();

    const firstDayOfMonth = new Date(currentDate);
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const lastDayOfMonth = new Date(firstDayOfMonth);
    lastDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const formattedFirstDay = formatDate(firstDayOfMonth);
    const formattedLastDay = formatDate(lastDayOfMonth);
    const reservasCollection = db.collection("reservas");

    const reservasSnapshot = await reservasCollection.where("Check in", ">=", formattedFirstDay).where('Check in', '<=', formattedLastDay).get();
    const docs = reservasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    let totalVentas = 0;

    for (const reserva of docs) {
        totalVentas += reserva.Valor;
    }
    const factura = totalVentas * 0.03;
    const totalVentasFormatted = totalVentas.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    const facturaFormatted = factura.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    const months = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
    ];

    const monthName = months[currentDate.getMonth()];
    const secretEmail = process.env.SECRET_EMAIL;


    const infoEmail = {
        billValue: facturaFormatted,
        comision: '3%',
        ventasTotales: totalVentasFormatted,
        numeroDeReservas: docs.length,
        aliado: 'Abya Yala Hostel',
        mes: monthName,
        secret: secretEmail,
    };

    return sendBillEmail(infoEmail);
});

const facturaManual = onCall(async (request) => {
    const currentDate = new Date(2024, 11, 1); // 11 = diciembre (meses en JavaScript son 0-indexados)

    const firstDayOfMonth = new Date(currentDate);
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const lastDayOfMonth = new Date(firstDayOfMonth);
    lastDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const formattedFirstDay = formatDate(firstDayOfMonth);
    const formattedLastDay = formatDate(lastDayOfMonth);
    const reservasCollection = db.collection("reservas");

    const reservasSnapshot = await reservasCollection.where("Check in", ">=", formattedFirstDay).where('Check in', '<=', formattedLastDay).get();
    const docs = reservasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    let totalVentas = 0;

    for (const reserva of docs) {
        totalVentas += reserva.Valor;
    }
    const factura = totalVentas * 0.03;
    const totalVentasFormatted = totalVentas.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    const facturaFormatted = factura.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    const months = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
    ];

    const monthName = months[currentDate.getMonth()];
    const secretEmail = process.env.SECRET_EMAIL;

    const infoEmail = {
        billValue: facturaFormatted,
        comision: '3%',
        ventasTotales: totalVentasFormatted,
        numeroDeReservas: docs.length,
        aliado: 'Abya Yala Hostel',
        mes: monthName,
        secret: secretEmail,
    };

    return sendBillEmail(infoEmail);
});

module.exports = { facturaFinal, facturaManual };
