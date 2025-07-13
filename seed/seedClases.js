const Clase = require('../models/clases');
const { faker } = require('@faker-js/faker/locale/es');

const clasesDisponibles = [
	{ nombre: 'Zumba', color: '#FF69B4' },
	{ nombre: 'Pilares', color: '#6A5ACD' },
	{ nombre: 'Cardio Fit', color: '#20B2AA' },
	{ nombre: 'Indoor Biking', color: '#FFA500' },
	{ nombre: 'Power Training', color: '#DC143C' },
	{ nombre: 'Funcional Total', color: '#4682B4' },
	{ nombre: 'HIIT Express', color: '#FF6347' },
	{ nombre: 'Box Fit', color: '#2E8B57' },
	{ nombre: 'Stretch & Flex', color: '#9ACD32' },
	{ nombre: 'Core 360', color: '#9370DB' },
	{ nombre: 'Full Body Burn', color: '#8B0000' },
	{ nombre: 'Yoga Flow', color: '#4169E1' },
	{ nombre: 'Strong Nation', color: '#8A2BE2' },
	{ nombre: 'Cross Training', color: '#FF8C00' },
	{ nombre: 'Glúteos de Acero', color: '#FF1493' },
	{ nombre: 'Cardio Dance', color: '#00CED1' },
	{ nombre: 'Pump & Sculpt', color: '#CD5C5C' },
	{ nombre: 'Kickboxing', color: '#228B22' },
	{ nombre: 'Mobility Training', color: '#9932CC' },
	{ nombre: 'Balance & Core', color: '#1E90FF' },
];

module.exports = async function seedClases(CLASES_TOTAL, instructores) {
	if (!instructores.length) {
		throw new Error('No hay instructores disponibles para asignar a las clases.');
	}

	const startMonth = new Date();
	startMonth.setDate(1);

	const clases = await Clase.insertMany(
		Array.from({ length: CLASES_TOTAL }).map(() => {
			const { nombre, color } = faker.helpers.arrayElement(clasesDisponibles);
			const dia = faker.number.int({ min: 1, max: 28 });
			const hora = faker.number.int({ min: 6, max: 20 });

			const fechaInicio = new Date(startMonth.getFullYear(), startMonth.getMonth(), dia, hora);
			const fechaFin = new Date(fechaInicio.getTime() + 2 * 60 * 60 * 1000); // +2 horas

			return {
				nombre,
				color,
				instructor: faker.helpers.arrayElement(instructores)._id,
				fechaInicio,
				fechaFin,
				cupoMax: faker.number.int({ min: 10, max: 30 }),
			};
		}),
	);

	return clases;
};
