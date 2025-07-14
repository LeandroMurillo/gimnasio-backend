const { MercadoPagoConfig, Preference } = require('mercadopago');
const Pago = require('../models/pagos');
const Usuario = require('../models/usuarios');
const Plan = require('../models/planes');
const { FRONTEND_URL } = process.env;
const isProduction = process.env.NODE_ENV === 'production';

const mercadopago = new MercadoPagoConfig({
	accessToken: process.env.MP_ACCESS_TOKEN,
});

/**
 * Crear una preferencia de pago con Mercado Pago
 */
const crearPreferencia = async (req, res) => {
	try {
		const { titulo, precio, planId } = req.body;
		const usuarioId = req.usuario._id;

		const preference = {
			items: [
				{
					title: titulo,
					unit_price: Math.round(parseFloat(precio)),
					quantity: 1,
				},
			],
			back_urls: {
				success: `${FRONTEND_URL}/success`,
				failure: `${FRONTEND_URL}/failure`,
				pending: `${FRONTEND_URL}/pending`,
			},
			...(isProduction && { auto_return: 'approved' }),
			metadata: {
				usuarioId,
				planId,
			},
			external_reference: JSON.stringify({ planId }),
		};

		const { id } = await new Preference(mercadopago).create({ body: preference });

		return res.json({ id });
	} catch (error) {
		console.error('❌ Error al crear preferencia:', error);
		return res.status(500).json({ error: 'No se pudo generar la preferencia' });
	}
};

/**
 * Registrar el pago recibido en el frontend
 */
const registrarPago = async (req, res) => {
	try {
		const { mercadoPagoId, planId, monto, status, captured_at } = req.body;
		const usuarioId = req.usuario._id;

		// Validación básica
		if (!mercadoPagoId || !planId || !monto || !status || !captured_at) {
			return res.status(400).json({ error: 'Faltan datos obligatorios del pago' });
		}

		// Verificar si el plan existe
		const plan = await Plan.findById(planId);
		if (!plan) {
			return res.status(404).json({ error: 'Plan no encontrado' });
		}

		// Verificar si ya se registró un pago con ese mercadoPagoId
		const pagoExistente = await Pago.findOne({ mercadoPagoId });
		if (pagoExistente) {
			return res.status(400).json({ error: 'Este pago ya fue registrado' });
		}

		// Crear nuevo registro de pago
		const nuevoPago = new Pago({
			mercadoPagoId,
			usuario: usuarioId,
			plan: planId,
			monto,
			status,
			captured_at: new Date(captured_at),
		});

		await nuevoPago.save();

		// Asignar el plan al usuario después del pago
		await Usuario.findByIdAndUpdate(usuarioId, { plan: planId });

		return res.status(201).json({ msg: 'Pago registrado y plan asignado correctamente' });
	} catch (error) {
		console.error('❌ Error al registrar pago:', error);
		return res.status(500).json({ error: 'Error al registrar el pago' });
	}
};

module.exports = { crearPreferencia, registrarPago };
