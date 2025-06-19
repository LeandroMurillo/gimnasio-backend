const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		const usuario = await Usuario.findById(uid);

		if (!usuario) {
			return res.status(401).json({
				msg: 'Token no válido - usuario no existe',
			});
		}

		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Token no válido - usuario inactivo',
			});
		}

		req.usuario = usuario;

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'Token no válido',
		});
	}
};

module.exports = {
	validarJWT,
};
