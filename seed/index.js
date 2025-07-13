require('dotenv').config();
const mongoose = require('mongoose');
const minimist = require('minimist');

// Importar módulos de seed
const seedUsuarios = require('./seedUsuarios');
const seedPagos = require('./seedPagos');
const seedClases = require('./seedClases');
const seedAsistencias = require('./seedAsistencias');
const seedConfiguracion = require('./seedConfiguracion');

const argv = minimist(process.argv.slice(2));
const USERS_TOTAL = argv.usuarios || 50;
const INSTRUCTORES_TOT = argv.instructores || 3;
const CLASES_TOTAL = argv.clases || 60;

// Modelos para limpiar la base
const Usuario = require('../models/usuarios');
const Plan = require('../models/planes');
const Clase = require('../models/clases');
const Asistencia = require('../models/asistencias');
const Pago = require('../models/pagos');
const Configuracion = require('../models/configuracion');

// Conexión a Mongo
async function connectDB() {
	await mongoose.connect(process.env.MONGODB_CNN);
	console.log('💾  DB conectada');
}

// Borrado de datos anteriores
async function cleanDatabase() {
	await Promise.all([
		Usuario.deleteMany({}),
		Plan.deleteMany({}),
		Clase.deleteMany({}),
		Asistencia.deleteMany({}),
		Pago.deleteMany({}),
		Configuracion.deleteMany({}),
	]);
}

(async () => {
	await connectDB();
	await cleanDatabase();

	console.log('⚙️  Poblando planes...');
	const planes = await Plan.insertMany([
		{
			nombre: 'Plan Musculación',
			descripcion: 'Accedé sin límites a nuestra sala de pesas...',
			precio: 4000,
			duracionMeses: 1,
		},
		{
			nombre: 'Plan Clases Ilimitadas',
			descripcion: 'Disfrutá de todas nuestras clases grupales...',
			precio: 5000,
			duracionMeses: 1,
		},
		{
			nombre: 'Plan Full Access',
			descripcion: 'Combiná lo mejor de ambos mundos...',
			precio: 6000,
			duracionMeses: 1,
		},
	]);

	console.log('👥 Poblando usuarios...');
	const { socios, instructores } = await seedUsuarios(USERS_TOTAL, INSTRUCTORES_TOT, planes);

	console.log('💳 Generando pagos...');
	await seedPagos(socios, planes);

	console.log('📅 Generando clases...');
	const clases = await seedClases(CLASES_TOTAL, instructores);

	console.log('📝 Generando asistencias...');
	await seedAsistencias(clases, socios);

	console.log('⚙️ Configuración general...');
	await seedConfiguracion();

	console.log('✅ Seed completado correctamente.');
	await mongoose.disconnect();
})();
