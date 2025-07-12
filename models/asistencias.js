const { Schema, model, Types } = require('mongoose');

const AsistenciaSchema = new Schema({
	clase: { type: Types.ObjectId, ref: 'Clase', required: true },
	usuario: { type: Types.ObjectId, ref: 'Usuario', required: true },
	fecha: { type: Date, default: Date.now },
});

AsistenciaSchema.index({ clase: 1, usuario: 1 }, { unique: true }); // evita duplicados

module.exports = model('Asistencia', AsistenciaSchema);
