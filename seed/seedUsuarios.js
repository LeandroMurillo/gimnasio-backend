const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker/locale/es');

function sinTildes(str) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, '')
		.toLowerCase();
}

module.exports = async function seedUsuarios(USERS_TOTAL, INSTRUCTORES_TOT, planes) {
	const salt = bcrypt.genSaltSync(10);

	// Función para generar un número de teléfono válido
	const generarTelefonoValido = () => {
		const codigoPais = '+54 9 11'; // Código de país y área para Argentina
		const numero = Math.floor(10000000 + Math.random() * 90000000); // Generar 8 dígitos aleatorios
		return `${codigoPais}${numero}`.replace(/\s+/g, ''); // Eliminar los espacios
	};

	// Crear admin
	await Usuario.create({
		nombre: 'Admin',
		apellido: 'Root',
		correo: 'admin@gimnasiorolling.com',
		telefono: generarTelefonoValido(),
		rol: 'admin',
		password: bcrypt.hashSync('123456', salt),
	});

	// Crear instructores
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
				telefono: generarTelefonoValido(),
				rol: 'instructor',
				password: bcrypt.hashSync('123456', salt),
			};
		}),
	);

	// Crear socios aleatorios sin plan
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
				telefono: generarTelefonoValido(),
				rol: 'usuario',
				password: bcrypt.hashSync('123456', salt),
			};
		}),
	);

	// Usuarios específicos con o sin plan
	const [planMusculacion, planClases, planFull] = [
		planes.find((p) => p.nombre === 'Plan Musculación'),
		planes.find((p) => p.nombre === 'Plan Clases Ilimitadas'),
		planes.find((p) => p.nombre === 'Plan Full Access'),
	];

	const usuariosEspeciales = await Usuario.insertMany([
		{
			nombre: 'Socio',
			apellido: 'SinPlan',
			correo: 'socio.sinplan@gimnasiorolling.com',
			telefono: generarTelefonoValido(),
			rol: 'usuario',
			password: bcrypt.hashSync('123456', salt),
			img: faker.image.avatar(),
			estado: true,
			plan: null,
		},
		{
			nombre: 'Socio',
			apellido: 'Musculacion',
			correo: 'socio.musculacion@gimnasiorolling.com',
			telefono: generarTelefonoValido(),
			rol: 'usuario',
			password: bcrypt.hashSync('123456', salt),
			img: faker.image.avatar(),
			estado: true,
			plan: planMusculacion,
		},
		{
			nombre: 'Socio',
			apellido: 'Clases',
			correo: 'socio.clases@gimnasiorolling.com',
			telefono: generarTelefonoValido(),
			rol: 'usuario',
			password: bcrypt.hashSync('123456', salt),
			img: faker.image.avatar(),
			estado: true,
			plan: planClases,
		},
		{
			nombre: 'Socio',
			apellido: 'Full',
			correo: 'socio.full@gimnasiorolling.com',
			telefono: generarTelefonoValido(),
			rol: 'usuario',
			password: bcrypt.hashSync('123456', salt),
			img: faker.image.avatar(),
			estado: true,
			plan: planFull,
		},
	]);

	return {
		instructores,
		socios: [...socios, ...usuariosEspeciales],
	};
};
