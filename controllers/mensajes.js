const Mensaje = require('../models/mensaje');

const obtenerMensajes = async (req, res) => {
	const start = parseInt(req.query._start) || 0;
	const end = parseInt(req.query._end) || 10;
	const limit = end - start;

	const total = await Mensaje.countDocuments();
	const mensajes = await Mensaje.find().sort({ fecha: -1 }).skip(start).limit(limit);

	const mensajesConId = mensajes.map((msg) => ({
		...msg.toObject(),
		id: msg._id,
	}));

	res.set('Content-Range', `mensajes ${start}-${end - 1}/${total}`);
	res.set('Access-Control-Expose-Headers', 'Content-Range');
	res.json(mensajesConId);
};

const crearMensaje = async (req, res) => {
	const { nombre, email, mensaje } = req.body;

	const nuevoMensaje = new Mensaje({ nombre, email, mensaje });
	await nuevoMensaje.save();

	res.status(201).json({ msg: 'Mensaje guardado correctamente' });
};

const borrarMensaje = async (req, res) => {
	const { id } = req.params;
	await Mensaje.findByIdAndDelete(id);
	res.json({ msg: 'Mensaje eliminado' });
};

module.exports = {
	obtenerMensajes,
	crearMensaje,
	borrarMensaje,
};
