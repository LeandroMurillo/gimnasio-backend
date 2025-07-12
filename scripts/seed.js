require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker/locale/es');
const bcrypt = require('bcryptjs');

/* ==== Models ==== */
const Configuracion = require('../models/configuracion');
const Usuario = require('../models/usuarios');
const Plan = require('../models/planes');
const Clase = require('../models/clases');
const Asistencia = require('../models/asistencias');
const Pago = require('../models/pagos');

/* ==== CLI params ==== */
const argv = require('minimist')(process.argv.slice(2));
const USERS_TOTAL = argv.usuarios || 50;
const INSTRUCTORES_TOT = argv.instructores || 3;
const CLASES_TOTAL = argv.clases || 60;

function sinTildes(str) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, '')
		.toLowerCase();
}

(async () => {
	await mongoose.connect(process.env.MONGODB_CNN);
	console.log('💾  DB conectada');

	// 1. Limpiar
	await Promise.all([
		Usuario.deleteMany({}),
		Plan.deleteMany({}),
		Clase.deleteMany({}),
		Asistencia.deleteMany({}),
		Pago.deleteMany({}),
	]);

	// 2. Planes
	const planes = await Plan.insertMany(
		['musculación', 'clases', 'full'].map((nombre, i) => ({
			nombre,
			descripcion: faker.commerce.productDescription(),
			precio: (i + 1) * 4000,
			duracionMeses: 1,
		})),
	);

	// 3. Usuarios
	const salt = bcrypt.genSaltSync(10);

	await Usuario.create({
		nombre: 'Admin',
		apellido: 'Root',
		correo: 'admin@gimnasiorolling.com',
		rol: 'admin',
		password: bcrypt.hashSync('123456', salt),
	});

	const instructores = await Usuario.insertMany(
		Array.from({ length: INSTRUCTORES_TOT }).map(() => {
			const nombres = faker.person.firstName();
			const apellidos = faker.person.lastName();
			const nomKey = sinTildes(nombres);
			const apeKey = sinTildes(apellidos);
			return {
				nombre: nombres,
				apellido: apellidos,
				correo: `${nomKey}.${apeKey}@gimnasiorolling.com`,
				rol: 'instructor',
				password: bcrypt.hashSync('123456', salt),
			};
		}),
	);

	const socios = await Usuario.insertMany(
		Array.from({ length: USERS_TOTAL }).map(() => {
			const nombres = faker.person.firstName();
			const apellidos = faker.person.lastName();
			const nomKey = sinTildes(nombres);
			const apeKey = sinTildes(apellidos);
			return {
				nombre: nombres,
				apellido: apellidos,
				correo: `${nomKey}.${apeKey}@gimnasiorolling.com`,
				rol: 'usuario',
				password: bcrypt.hashSync('123456', salt),
			};
		}),
	);

	// Usuario de prueba
	const socioTest = await Usuario.create({
		nombre: 'Juan',
		apellido: 'Tester',
		correo: 'juan.tester@gimnasiorolling.com',
		rol: 'usuario',
		password: bcrypt.hashSync('123456', salt),
	});
	socios.push(socioTest);

	// 4. Pagos y asignación de plan
	for (const socio of socios) {
		const planAsignado = faker.helpers.arrayElement(planes);

		await Pago.create({
			usuario: socio._id,
			plan: planAsignado._id,
			monto: planAsignado.precio,
			status: 'approved',
			mercadoPagoId: faker.string.alphanumeric(8),
			captured_at: new Date(),
		});

		await Usuario.findByIdAndUpdate(socio._id, { plan: planAsignado._id });
		socio.plan = planAsignado; // Añadir referencia al objeto usuario para filtrar luego
	}

	// 5. Clases
	const startMonth = new Date();
	startMonth.setDate(1);

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

	const clases = await Clase.insertMany(
		Array.from({ length: CLASES_TOTAL }).map(() => {
			const { nombre, color } = faker.helpers.arrayElement(clasesDisponibles);
			const dia = faker.number.int({ min: 1, max: 28 });
			const hora = faker.number.int({ min: 6, max: 20 });
			const fechaInicio = new Date(startMonth.getFullYear(), startMonth.getMonth(), dia, hora);
			const fechaFin = new Date(fechaInicio);
			fechaFin.setHours(fechaInicio.getHours() + 2);

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

	// 6. Asistencias solo para usuarios con plan 'clases' o 'full'
	const sociosConClases = socios.filter((u) => ['clases', 'full'].includes(u.plan?.nombre));

	await Asistencia.insertMany(
		clases.flatMap((clase) =>
			faker.helpers
				.arrayElements(sociosConClases, faker.number.int({ min: 0, max: clase.cupoMax }))
				.map((u) => ({
					usuario: u._id,
					clase: clase._id,
					ingreso: clase.fechaInicio,
				})),
		),
	);

	// 7. Configuración
	await Configuracion.deleteMany();
	await Configuracion.create({
		nombre: 'Gimnasio Rolling',
		direccion: 'Av. Fitness 123',
		ciudad: 'San Miguel de Tucumán',
		email: 'gimnasio_rolling@gmail.com',
		telefono: '(011) 1234 5678',
		whatsapp: '+54 9 11 1111 1111',
		redes: {
			facebook: 'https://facebook.com/gimnasiorolling',
			instagram: 'https://instagram.com/gimnasiorolling',
		},
		ubicacion: {
			iframeSrc: 'https://www.google.com/maps/embed?pb=...',
		},
	});

	console.log('✅ Seed completado correctamente.');
	mongoose.disconnect();
})();
