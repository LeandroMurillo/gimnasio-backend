const Configuracion = require('../models/configuracion');

module.exports = async function seedConfiguracion() {
	await Configuracion.deleteMany(); // asegurarse de que no haya conflictos

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
};
