const { Schema, model, Types } = require('mongoose');

const ClaseSchema = new Schema(
	{
		nombre: {
			type: String,
			required: true,
		},
		descripcion: {
			type: String,
			required: false,
		},
		imagenUrl: {
			type: String,
			required: false,
		},
		categoria: {
			type: Types.ObjectId,
			ref: 'Categoria',
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
		planesPermitidos: [
			{
				type: Types.ObjectId,
				ref: 'Plan',
				required: true,
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = model('Clase', ClaseSchema);
