const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
console.log('Usuario model:', Usuario); // Depuración
const { generarJWT } = require('../helpers/generar-jwt');


const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ correo });

		//Verificar si el correo existe
		if (!usuario) {
			return res.status(400).json({
				msg: 'Correo o password incorrectos | usuario inexistente',
			});
		}

		//Verificar si el usuario está activo
		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'Correo o password incorrectos | usuario inactivo',
			});
		}

		//Verificar la contraseña
		const validPassword = bcrypt.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'Correo o password incorrectos | password erróneo',
			});
		}

		//Generar el token
		const token = await generarJWT(usuario.id);

		res.json({
			msg: 'Login Ok',
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Hable con el administrador del sistema',
		});
	}
};

const register = async (req, res) => {
	console.log('Solicitud a /register recibida');
	const { nombre, apellido, correo, password, rol, telefono, plan } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const usuario = new Usuario({
			nombre,
			apellido,
			correo,
			password: hashedPassword,
			rol,
			telefono,
			plan,
		});
		await usuario.save();
		res.status(201).json({ message: 'Usuario registrado' });
	} catch (error) {
		console.error('Error en /register:', error);
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	login, register 
};
