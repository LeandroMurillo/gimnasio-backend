const { Schema, model } = require('mongoose');

const ClaseSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la clase es obligatorio'],
    enum: ['yoga', 'zumba', 'spinning', 'boxeo'], // Ejemplo
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
  },
  hora: {
    type: String,
    required: [true, 'La hora es obligatoria'],
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM
  },
  instructor: {
    type: String,
    required: [true, 'El instructor es obligatorio'],
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad debe ser al menos 1'],
  },
  inscritos: {
    type: Number,
    default: 0,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

module.exports = model('Clase', ClaseSchema);