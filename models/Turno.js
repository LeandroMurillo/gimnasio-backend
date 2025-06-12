const { Schema, model } = require('mongoose');

const TurnoSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio'],
    },
    clase: {
        type: Schema.Types.ObjectId,
        ref: 'Clase',
        required: [true, 'La clase es obligatoria']
    },
    estado: {
        type: String,
        enum: ['reservado', 'cancelado'],
        default: 'reservado',
    },
    creadoEn: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Turno', TurnoSchema);