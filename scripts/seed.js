require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker/locale/es');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

function sinTildes(str) {
	return str
		.normalize('NFD') 
		.replace(/[\u0300-\u036f]/g, '') 
		.replace(/\s+/g, '')
		.toLowerCase();
}

/* ==== Models ==== */
const Usuario = require('../models/usuarios');
const Categoria = require('../models/categorias');
const Plan = require('../models/planes');
const Clase = require('../models/clases');
const Asistencia = require('../models/asistencias');
const Pago = require('../models/pagos');

/* ==== Parámetros CLI ==== */
const USERS_TOTAL = argv.usuarios || 50;
const INSTRUCTORES_TOT = argv.instructores || 3;
const CLASES_TOTAL = argv.clases || 60;

(async () => {
	await mongoose.connect(process.env.MONGODB_CNN);
	console.log('💾  DB conectada');

	/* 1. Limpiamos las colecciones anteriores */
	await Promise.all([
		Usuario.deleteMany({}),
		Categoria.deleteMany({}),
		Plan.deleteMany({}),
		Clase.deleteMany({}),
		Asistencia.deleteMany({}),
		Pago.deleteMany({}),
	]);

	/* 2. Categorías */
	const categorias = await Categoria.insertMany(
		Array.from({ length: 5 }).map(() => ({
			nombre: faker.commerce.department(),
			color: faker.color.rgb(),
			estado: true,
		})),
	);

	/* 3. Planes */
	const planes = await Plan.insertMany(
		['Básico', 'Plus', 'Premium'].map((nombre, i) => ({
			nombre,
			descripcion: faker.commerce.productDescription(),
			precio: (i + 1) * 4000,
			duracionMeses: 1,
			categoriasPermitidas: categorias.filter((_, idx) => idx <= i).map((c) => c._id),
		})),
	);

	/* 4. Usuarios */
	const salt = bcrypt.genSaltSync(10);

	await Usuario.create({
		nombre: 'Admin',
		apellido: 'Root',
		correo: 'admin@gimnasiorolling.com',
		rol: 'ADMIN',
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
				rol: 'INSTRUCTOR',
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
				rol: 'SOCIO',
				password: bcrypt.hashSync('123456', salt),
			};
		}),
	);

	/* 5. Clases */
	const startMonth = new Date();
	startMonth.setDate(1);

	const clases = await Clase.insertMany(
		Array.from({ length: CLASES_TOTAL }).map(() => {
			const dia = faker.number.int({ min: 1, max: 28 });
			const hora = faker.number.int({ min: 6, max: 21 });
			const fechaInicio = new Date(startMonth.getFullYear(), startMonth.getMonth(), dia, hora);
			const fechaFin = new Date(fechaInicio);
			fechaFin.setHours(fechaInicio.getHours() + 1);

			return {
				nombre: faker.company.catchPhrase(),
				categoria: faker.helpers.arrayElement(categorias)._id,
				instructor: faker.helpers.arrayElement(instructores)._id,
				fechaInicio,
				fechaFin,
				cupoMax: faker.number.int({ min: 10, max: 30 }),
				planesPermitidos: faker.helpers.arrayElements(planes, 2).map((p) => p._id),
			};
		}),
	);

	/* 6. Asistencias */
	await Asistencia.insertMany(
		clases.flatMap((clase) =>
			faker.helpers
				.arrayElements(socios, faker.number.int({ min: 0, max: clase.cupoMax }))
				.map((u) => ({
					usuario: u._id,
					clase: clase._id,
					ingreso: clase.fechaInicio,
				})),
		),
	);

	/* 7. Pagos */
	await Pago.insertMany(
		socios.map((u) => ({
			usuario: u._id,
			plan: faker.helpers.arrayElement(planes)._id,
			monto: faker.finance.amount({ min: 4000, max: 12000, dec: 0 }),
			status: faker.helpers.arrayElement(['approved', 'rejected']),
			mercadoPagoId: faker.string.alphanumeric(8),
			captured_at: new Date(),
		})),
	);

	const dumpDir = path.join(__dirname, 'dump');
	if (!fs.existsSync(dumpDir)) fs.mkdirSync(dumpDir);

	const allData = await exportAll();
	fs.writeFileSync(path.join(dumpDir, 'seed.json'), JSON.stringify(allData, null, 2));

	const createCsvWriter = require('csv-writer').createObjectCsvWriter;
	for (const [collectionName, records] of Object.entries(allData)) {
		if (!Array.isArray(records) || records.length === 0) continue;

		const header = Object.keys(records[0]).map((prop) => ({
			id: prop,
			title: prop,
		}));

		const csvPath = path.join(dumpDir, `${collectionName}.csv`);
		await createCsvWriter({ path: csvPath, header }).writeRecords(records);
		console.log(`✅  CSV de ${collectionName} creado en ${csvPath}`);
	}

	console.log('✅  Seed completado y dumps en ./scripts/dump');
	mongoose.disconnect();
})();

async function exportAll() {
	const [usuarios, categorias, planes, clases, asistencias, pagos] = await Promise.all([
		Usuario.find().lean(),
		Categoria.find().lean(),
		Plan.find().lean(),
		Clase.find().lean(),
		Asistencia.find().lean(),
		Pago.find().lean(),
	]);
	return { usuarios, categorias, planes, clases, asistencias, pagos };
}
