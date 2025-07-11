const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			return res.status(400).json({
				msg: 'Correo o password incorrectos | usuario inexistente',
			});
		}

		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'Correo o password incorrectos | usuario inactivo',
			});
		}

		const validPassword = bcrypt.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'Correo o password incorrectos | password erróneo',
			});
		}

		const token = await generarJWT(usuario.id);

		// Crear objeto de respuesta sin password ni __v
		const { _id, nombre, apellido, correo: email, rol } = usuario;

		res.json({
			_id,
			nombre,
			apellido,
			email,
			rol,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Hable con el administrador del sistema',
		});
	}
};

module.exports = {
	login,
};
