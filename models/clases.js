const { Schema, model, Types } = require('mongoose');

const ClaseSchema = new Schema(
	{
		nombre: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		instructor: {
			type: Types.ObjectId,
			ref: 'Usuario',
			required: true,
		},
		fechaInicio: {
			type: Date,
			required: true,
		},
		fechaFin: {
			type: Date,
			required: true,
		},
		cupoMax: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model('Clase', ClaseSchema);
