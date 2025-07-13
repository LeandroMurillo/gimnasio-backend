const mongoose = require('mongoose');
const Usuario = require('../models/usuarios');
const Pago = require('../models/pagos');
const { faker } = require('@faker-js/faker/locale/es');

module.exports = async function seedPagos(socios, planes) {
	for (const socio of socios) {
		let plan = socio.plan;

		// Si no tiene plan, se le asigna uno aleatoriamente y se actualiza en DB
		if (!plan) {
			plan = faker.helpers.arrayElement(planes);
			await Usuario.findByIdAndUpdate(socio._id, { plan: plan._id });
		}

		// Verificamos que sea un objeto válido
		if (typeof plan === 'string' || plan instanceof mongoose.Types.ObjectId) {
			plan = planes.find((p) => p._id.equals(plan));
		}

		if (!plan) continue;

		await Pago.create({
			usuario: socio._id,
			plan: plan._id,
			monto: plan.precio,
			status: 'approved',
			mercadoPagoId: faker.string.alphanumeric(8),
			captured_at: new Date(),
		});
	}
};
