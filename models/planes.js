const { Schema, model, Types } = require('mongoose');

const PlanSchema = new Schema(
	{
		nombre: {
			type: String,
			required: [true, 'El nombre del plan es obligatorio'],
			trim: true,
			minlength: [1, 'El nombre no puede estar vacío'],
		},
		descripcion: {
			type: String,
			required: [true, 'La descripción es obligatoria'],
			trim: true,
			minlength: [1, 'La descripción no puede estar vacía'],
		},
		precio: {
			type: Number,
			required: [true, 'El precio es obligatorio'],
			min: [0.01, 'El precio debe ser mayor que cero'],
		},
		duracionMeses: {
			type: Number,
			required: [true, 'La duración es obligatoria'],
			min: [1, 'La duración debe ser al menos de 1 mes'],
			validate: {
				validator: Number.isInteger,
				message: 'La duración debe ser un número entero',
			},
		},
		categoriasPermitidas: [
			{
				type: Types.ObjectId,
				ref: 'Categoria',
			},
		],
	},
	{ timestamps: true },
);

module.exports = model('Plan', PlanSchema);
