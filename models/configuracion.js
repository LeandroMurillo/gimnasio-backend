const { Schema, model } = require('mongoose');

const ConfiguracionSchema = new Schema({
	_id: { type: String, default: 'default' },
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

module.exports = model('Configuracion', ConfiguracionSchema, 'configuracion');
