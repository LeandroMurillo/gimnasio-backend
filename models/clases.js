const { Schema, model, Types } = require('mongoose');

const ClaseSchema = new Schema(
	{
		nombre: {
			type: String,
			required: [true, 'El nombre es obligatorio'],
			trim: true,
			minlength: [1, 'El nombre no puede estar vacío'],
		},
		color: {
			type: String,
			required: true,
			match: [/^#([0-9A-Fa-f]{3}){1,2}$/, 'El color debe estar en formato hexadecimal'],
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
			validate: {
				validator: function (value) {
					return !this.fechaInicio || value > this.fechaInicio;
				},
				message: 'La fecha de fin debe ser posterior a la fecha de inicio',
			},
		},
		cupoMax: {
			type: Number,
			required: true,
			default: 30,
			min: [1, 'El cupo máximo debe ser mayor que cero'],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model('Clase', ClaseSchema);
