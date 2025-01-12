const formValidations = async (request) => {
  const {
    nombre,
    correo,
    celular,
    cedula,
    acompanantes,
    amountRooms,
    checkIn,
    checkOut,
    infoAcompanantes,
    precio,
    cabana,
    timestamp,
    urlInvoice,
    status,
    idReserva,
  } = request;

  const fields = [
    {
      key: 'nombre',
      value: nombre,
      type: 'string',
      error: 'Dato incorrecto en el Nombre',
    },
    {
      key: 'celular',
      value: celular,
      type: 'number',
      error: 'El campo teléfono es obligatorio',
    },
    {
      key: 'correo',
      value: correo,
      type: 'string',
      error: 'El campo email es obligatorio',
    },
    {
      key: 'cedula',
      value: cedula,
      type: 'string',
      error: 'El campo cédula es obligatorio',
    },
    {
      key: 'acompanantes',
      value: acompanantes,
      type: 'number',
      error: 'El campo acompañantes es obligatorio',
    },
    {
      key: 'infoAcompanantes',
      value: infoAcompanantes,
      type: 'number',
      error: 'El campo acompañantes es obligatorio',
    },
    {
      key: 'amountRooms',
      value: amountRooms,
      type: 'number',
      error: 'El campo cantidad de cabañas es obligatorio',
    },
    {
      key: 'checkIn',
      value: checkIn,
      type: 'string',
      error: 'El campo check in es obligatorio',
    },
    {
      key: 'checkOut',
      value: checkOut,
      type: 'string',
      error: 'El campo check out es obligatorio',
    },
    {
      key: 'infoAcompanantes',
      value: infoAcompanantes,
      type: 'string',
      error: 'El campo información de acompañantes es obligatorio',
    },
    {
      key: 'precio',
      value: precio,
      type: 'number',
      error: 'El campo precio es obligatorio',
    },
    {
      key: 'cabana',
      value: cabana,
      type: 'string',
      error: 'El campo tipo de cabaña es obligatorio',
    },
    {
      key: 'timestamp',
      value: timestamp,
      type: 'string',
      error: 'El campo timestamp es obligatorio',
    },
    {
      key: 'urlInvoice',
      value: urlInvoice,
      type: 'string',
      error: 'El campo url de la factura es obligatorio',
    },
    {
      key: 'status',
      value: status,
      type: 'string',
      error: 'El campo status es obligatorio',
    },
    {
      key: 'idReserva',
      value: idReserva,
      type: 'string',
      error: 'El campo id de la reserva es obligatorio',
    },
  ];

  const errors = fields
    .filter(({ value, type }) => typeof value !== type)
    .map(({ error }) => error);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, message: 'Formulario enviado correctamente' };
};

module.exports = {
  formValidations,
};
