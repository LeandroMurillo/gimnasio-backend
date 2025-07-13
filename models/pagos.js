const { Schema, model, Types } = require('mongoose');

const PagoSchema = new Schema(
	{
		mercadoPagoId: {
			type: String,
			required: [true, 'El ID de Mercado Pago es obligatorio'],
			trim: true,
			minlength: [1, 'El ID de Mercado Pago no puede estar vacío'],
		},
		usuario: {
			type: Types.ObjectId,
			ref: 'Usuario',
			required: [true, 'El usuario es obligatorio'],
		},
		plan: {
			type: Types.ObjectId,
			ref: 'Plan',
			required: [true, 'El plan es obligatorio'],
		},
		monto: {
			type: Number,
			required: [true, 'El monto es obligatorio'],
			min: [0.01, 'El monto debe ser mayor que cero'],
		},
		status: {
			type: String,
			enum: ['approved', 'rejected'],
			required: [true, 'El estado del pago es obligatorio'],
		},
		captured_at: {
			type: Date,
			required: [true, 'La fecha de captura es obligatoria'],
		},
	},
	{ timestamps: true },
);

module.exports = model('Pago', PagoSchema);
