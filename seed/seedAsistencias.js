const Asistencia = require('../models/asistencias');
const { faker } = require('@faker-js/faker/locale/es');

module.exports = async function seedAsistencias(clases, socios) {
	const sociosConClases = socios.filter((socio) => {
		const nombrePlan = socio.plan?.nombre;
		return nombrePlan === 'Plan Clases Ilimitadas' || nombrePlan === 'Plan Full Access';
	});

	const asistencias = clases.flatMap((clase) => {
		const cantidad = faker.number.int({ min: 0, max: clase.cupoMax });
		const asistentes = faker.helpers.arrayElements(sociosConClases, cantidad);

		return asistentes.map((usuario) => ({
			usuario: usuario._id,
			clase: clase._id,
			ingreso: clase.fechaInicio,
		}));
	});

	await Asistencia.insertMany(asistencias);
};
