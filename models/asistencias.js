const { Schema, model, Types } = require('mongoose');

const AsistenciaSchema = new Schema(
	{
		usuario: { type: Types.ObjectId, ref: 'Usuario', required: true },
		clase: { type: Types.ObjectId, ref: 'Clase', required: true },
		ingreso: { type: Date, required: true },
	},
	{ timestamps: true },
);

module.exports = model('Asistencia', AsistenciaSchema);
