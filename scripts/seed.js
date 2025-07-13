require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker/locale/es');
const bcrypt = require('bcryptjs');

const Configuracion = require('../models/configuracion');
const Usuario = require('../models/usuarios');
const Plan = require('../models/planes');
const Clase = require('../models/clases');
const Asistencia = require('../models/asistencias');
const Pago = require('../models/pagos');

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

	await Promise.all([
		Usuario.deleteMany({}),
		Plan.deleteMany({}),
		Clase.deleteMany({}),
		Asistencia.deleteMany({}),
		Pago.deleteMany({}),
	]);

	// === PLANES ACTUALIZADOS ===
	const planes = await Plan.insertMany([
		{
			nombre: 'Plan Musculación',
			descripcion:
				'Accedé sin límites a nuestra sala de pesas y máquinas de última generación. Ideal para quienes entrenan de forma autónoma, con rutinas personalizadas o asesoramiento básico de nuestros instructores. Incluye vestuarios con duchas, lockers personales y acceso a turnos flexibles. ¡Entrená a tu ritmo, sin distracciones!',
			precio: 4000,
			duracionMeses: 1,
		},
		{
			nombre: 'Plan Clases Ilimitadas',
			descripcion:
				'Disfrutá de todas nuestras clases grupales sin restricciones: Fit Dance, Zumba, Spinning, Funcional, Yoga, Ritmos, GAP y más. Entrenamientos energizantes guiados por profesionales, pensados para todos los niveles. Incluye reserva online, acceso a vestuarios y seguimiento de progreso. ¡Motivate con el grupo y superate día a día!',
			precio: 5000,
			duracionMeses: 1,
		},
		{
			nombre: 'Plan Full Access',
			descripcion:
				'Combiná lo mejor de ambos mundos: acceso total a la sala de musculación y participación ilimitada en todas las clases grupales. Entrená cuando y como quieras, con soporte integral de nuestro equipo. Este plan incluye turnos libres, lockers, vestuarios y prioridad en reservas. ¡Es el plan más completo para quienes no se ponen límites!',
			precio: 6000,
			duracionMeses: 1,
		},
	]);

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

	// Buscar los planes ya insertados por nombre
	const planMusculacion = planes.find((p) => p.nombre === 'Plan Musculación');
	const planClases = planes.find((p) => p.nombre === 'Plan Clases Ilimitadas');
	const planFull = planes.find((p) => p.nombre === 'Plan Full Access');

	// Usuario sin plan
	const socioSinPlan = await Usuario.create({
		nombre: 'Socio',
		apellido: 'SinPlan',
		correo: 'socio.sinplan@gimnasiorolling.com',
		rol: 'usuario',
		password: bcrypt.hashSync('123456', salt),
		img: faker.image.avatar(),
		estado: true,
		plan: null,
	});

	// Usuario con plan musculación
	const socioMusculacion = await Usuario.create({
		nombre: 'Socio',
		apellido: 'Musculacion',
		correo: 'socio.musculacion@gimnasiorolling.com',
		rol: 'usuario',
		password: bcrypt.hashSync('123456', salt),
		img: faker.image.avatar(),
		estado: true,
		plan: planMusculacion._id,
	});

	// Usuario con plan clases
	const socioClases = await Usuario.create({
		nombre: 'Socio',
		apellido: 'Clases',
		correo: 'socio.clases@gimnasiorolling.com',
		rol: 'usuario',
		password: bcrypt.hashSync('123456', salt),
		img: faker.image.avatar(),
		estado: true,
		plan: planClases._id,
	});

	// Usuario con plan full
	const socioFull = await Usuario.create({
		nombre: 'Socio',
		apellido: 'Full',
		correo: 'socio.full@gimnasiorolling.com',
		rol: 'usuario',
		password: bcrypt.hashSync('123456', salt),
		img: faker.image.avatar(),
		estado: true,
		plan: planFull._id,
	});

	// Insertar pagos simulados solo para los que tienen plan
	await Pago.insertMany([
		{
			usuario: socioMusculacion._id,
			plan: planMusculacion._id,
			monto: planMusculacion.precio,
			status: 'approved',
			mercadoPagoId: faker.string.alphanumeric(8),
			captured_at: new Date(),
		},
		{
			usuario: socioClases._id,
			plan: planClases._id,
			monto: planClases.precio,
			status: 'approved',
			mercadoPagoId: faker.string.alphanumeric(8),
			captured_at: new Date(),
		},
		{
			usuario: socioFull._id,
			plan: planFull._id,
			monto: planFull.precio,
			status: 'approved',
			mercadoPagoId: faker.string.alphanumeric(8),
			captured_at: new Date(),
		},
	]);

	// Agregarlos a la lista de socios
	socios.push(socioSinPlan, socioMusculacion, socioClases, socioFull);

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
		socio.plan = planAsignado;
	}

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

	// === ACTUALIZACIÓN DE NOMBRES DE PLAN PARA FILTRO ===
	const sociosConClases = socios.filter((u) =>
		['Plan Clases Ilimitadas', 'Plan Full Access'].includes(u.plan?.nombre),
	);

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

	await Configuracion.deleteMany();
	await Configuracion.create({
		_id: 'default',
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
