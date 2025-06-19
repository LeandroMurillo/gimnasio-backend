const { Schema, model, Types } = require('mongoose');

const PagoSchema = new Schema(
	{
		mercadoPagoId: { type: String, required: true },
		usuario: { type: Types.ObjectId, ref: 'Usuario', required: true },
		plan: { type: Types.ObjectId, ref: 'Plan', required: true },
		monto: { type: Number, required: true },
		status: { type: String, enum: ['approved', 'rejected'], required: true },
		captured_at: { type: Date, required: true },
	},
	{ timestamps: true },
);

module.exports = model('Pago', PagoSchema);
