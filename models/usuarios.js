const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
		trim: true,
		minlength: [1, 'El nombre no puede estar vacío'],
	},
	apellido: {
		type: String,
		required: [true, 'El apellido es obligatorio'],
		trim: true,
		minlength: [1, 'El apellido no puede estar vacío'],
	},
	correo: {
		type: String,
		required: [true, 'El correo es obligatorio'],
		unique: true,
		trim: true,
		match: [
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			'El correo debe tener un formato válido (ej: usuario@dominio.com)',
		],
	},
	telefono: {
		type: String,
		required: [true, 'El número de teléfono es obligatorio'],
		trim: true,
		match: [
			/^\+?\d{7,15}$/,
			'El número de teléfono debe tener entre 7 y 15 dígitos, y puede comenzar con "+"',
		],
	},
	password: {
		type: String,
		required: [true, 'La contraseña es obligatoria'],
		minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
	},
	img: {
		type: String,
		trim: true,
	},
	rol: {
		type: String,
		required: [true, 'El rol es obligatorio'],
		trim: true,
		// enum: ['admin', 'usuario', 'instructor'],
	},
	fechaRegistro: {
		type: Date,
		default: Date.now,
	},
	plan: {
		type: Schema.Types.ObjectId,
		ref: 'Plan',
		default: null,
	},
	estado: {
		type: Boolean,
		default: true,
	},

	// ──────── Campos adicionales para instructores ────────
	especialidad: {
		type: String,
		trim: true,
	},
	descripcion: {
		type: String,
		trim: true,
	},
	redes: {
		instagram: { type: String, trim: true },
		facebook: { type: String, trim: true },
		linkedin: { type: String, trim: true },
	},
});

module.exports = model('Usuario', UsuarioSchema);
