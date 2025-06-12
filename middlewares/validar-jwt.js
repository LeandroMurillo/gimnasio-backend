const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token');
	console.log('Token recibido:', token); /* DEPURACION */
	//Preguntar si nos enviaron el token
	if (!token) {
		console.log('No hay token en la peticion'); /* DEPURACION */
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}

	//Si enviaron el token
	try {
		//Verificar el token y obtener el uid
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
		console.log('Token verificado, UID', uid); /* DEPURACION */
		//Obtener los datos del usuario autenticado (uid)
		const usuario = await Usuario.findById(uid);
		console.log('Usuario encontrado:', usuario ? usuario._id : 'No existe'); /* DEPURACION */
		//Validar si el usuario existe
		if (!usuario) {
			console.log('Usuario no existe en la base de datos'); /* DEPURACION */
			return res.status(401).json({
				msg: 'Token no válido - usuario no existe',
			});
		}

		//Validar si el usuario está activo
		if (!usuario.estado) {
			console.log('Usuario inactivo'); /* DEPURACION */
			return res.status(401).json({
				msg: 'Token no válido - usuario inactivo',
			});
		}

		req.usuario = usuario;
		console.log('Usuario asignado a req.usuario:', usuario._id); /* DEPURACION */
		next();
	} catch (error) {
		console.log('Error en validarJWT:', error.message); /* DEPURACION */
		res.status(401).json({
			msg: 'Token no válido',
		});
	}
};

module.exports = {
	validarJWT,
};
