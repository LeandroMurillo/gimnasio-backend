const { Schema, model } = require('mongoose');

const ConfiguracionSchema = new Schema({
	nombre: String,
	direccion: String,
	ciudad: String,
	email: String,
	telefono: String,
	whatsapp: String,
	redes: {
		facebook: String,
		instagram: String,
	},
	ubicacion: {
		iframeSrc: String,
	},
});

module.exports = model('Configuracion', ConfiguracionSchema);
