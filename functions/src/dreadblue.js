const { onSchedule } = require("firebase-functions/v2/scheduler");
const { db } = require("./firebase");
const { onCall } = require("firebase-functions/v2/https");
const { sendBillEmail } = require("./google");
const dayjs = require("dayjs");

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

const firestoreTesting = onCall(async () => {
    const checkin = dayjs().format('YYYY-MM-DD');
    const checkout = dayjs().add(1, 'day').format('YYYY-MM-DD');
    await db.collection('reservas').doc('ABY000').set({
        'Cantidad de cabañas': 1,
        'Cantidad de huespedes': '1',
        'Celular': '3008082345',
        'Check in': checkin,
        'Check out': checkout,
        'Correo': 'cprada33@hotmail.com',
        'Cedula': '432442342',
        'Información de acompañantes': 'ddadasdas',
        'Nombre': 'Cristian',
        'Tipo de cabaña': 'Safari',
        'Valor': 420000,
        'idReserva': 'ABY000',
        'status': 'pending',
        'timestamp': dayjs().format('YYYY-MM-DD HH:mm:ss'),
        'path': 'comprobantes/ABY000',
        'torrentismo': 2,
        'canopy': 0,
        'rafting': 0,
        'menu': {
            plato: {
                precio: 20000,
                nombre: 'ajiaco',
            },
        },
        'precioMenu': 100000,
        'precioActividades': 50000,
        'precioFinal': 300000,

    });
    await db.collection('availability').doc(`safari_${checkin}`).set({
        date: checkin,
        room_id: 'safari',
        spots: 20,
    });
    await db.collection('availability').doc(`ancestral${checkin}`).set({
        date: checkin,
        room_id: 'ancestral',
        spots: 1,
    });
    await db.collection('availability').doc(`anamay${checkin}`).set({
        date: checkin,
        room_id: 'anamay',
        spots: 1,
    });
    await db.collection('requests').doc('ABY000').set({
        newBooking: {
            'Cantidad de cabañas': 1,
            'Cantidad de huespedes': '1',
            'Celular': '3008082345',
            'Check in': checkin,
            'Check out': checkout,
            'Correo': 'cprada33@hotmail.com',
            'Cedula': '432442342',
            'Información de acompañantes': 'ddadasdas',
            'Nombre': 'Felipe',
            'Tipo de cabaña': 'Safari',
            'Valor': 420000,
            'idReserva': 'ABY000',
            'status': 'pending',
            'timestamp': dayjs().format('YYYY-MM-DD HH:mm:ss'),
            'path': 'comprobantes/ABY000',
            'torrentismo': 2,
            'canopy': 0,
            'rafting': 0,
            'menu': {
                plato: {
                    precio: 20000,
                    nombre: 'ajiaco',
                },
            },
            'precioMenu': 100000,
            'precioActividades': 50000,
            'precioFinal': 300000,

        },
        id: 'ABY000',
        nombre: 'Cristian',
        status: 'pending',
        tipo: 'Nombre',
        solicitud: {
            1: {
                solicitud: 'Cambiar nombre de Cristian a Felipe',
            },
        },
    });
});

module.exports = { facturaFinal, facturaManual, firestoreTesting };
