const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');

const usuarioGet = async (req = request, res = response) => {
	const baseQuery = { estado: true };

	const filter = JSON.parse(req.query.filter || '{}');
	const sortArr = JSON.parse(req.query.sort || '["_id","ASC"]');
	let [sortField, sortOrder] = sortArr;
	if (sortField === 'id') {
		sortField = '_id';
	}
	const rangeArr = JSON.parse(req.query.range || '[0,9]');
	const [start, end] = rangeArr;
	const limit = end - start + 1;

	const total = await Usuario.countDocuments({ ...baseQuery, ...filter });

	const usuariosRaw = await Usuario.find({ ...baseQuery, ...filter })
		.sort({ [sortField]: sortOrder.toUpperCase() === 'ASC' ? 1 : -1 })
		.skip(start)
		.limit(limit);

	const usuarios = usuariosRaw.map((u) => {
		const obj = u.toObject();
		obj.id = obj._id;
		delete obj._id;
		delete obj.password;
		return obj;
	});

	res.set('Content-Range', `usuarios ${start}-${start + usuarios.length - 1}/${total}`);
	res.set('Access-Control-Expose-Headers', 'Content-Range');

	res.json(usuarios);
};

const usuarioGetID = async (req = request, res = response) => {
	const { id } = req.params;
	try {
		const usuario = await Usuario.findById(id);
		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		const userObj = usuario.toObject();
		userObj.id = userObj._id;
		delete userObj._id;
		delete userObj.password;
		return res.json(userObj);
	} catch (err) {
		console.error('Error en usuarioGetID:', err);
		return res.status(500).json({ error: 'Error interno al obtener usuario' });
	}
};

const usuarioPost = async (req = request, res = response) => {
	try {
		const { nombre, apellido, correo, password, rol, estado = true } = req.body;
		const errors = {};
		if (!nombre) errors.nombre = ['El nombre es obligatorio'];
		if (!apellido) errors.apellido = ['El apellido es obligatorio'];
		if (!correo) errors.correo = ['El correo es obligatorio'];
		if (!password) errors.password = ['La contraseña es obligatoria'];
		if (!rol) errors.rol = ['El rol es obligatorio'];
		if (Object.keys(errors).length) {
			return res.status(400).json({ errors });
		}
		const usuario = new Usuario({ nombre, apellido, correo, password, rol, estado });
		const salt = bcrypt.genSaltSync(10);
		usuario.password = bcrypt.hashSync(password, salt);
		const saved = await usuario.save();
		const userObj = saved.toObject();
		userObj.id = userObj._id;
		delete userObj._id;
		delete userObj.password;
		return res.status(201).json(userObj);
	} catch (err) {
		console.error('Error en usuarioPost:', err);
		return res.status(500).json({ error: 'Error interno al crear usuario' });
	}
};

const usuarioPut = async (req = request, res = response) => {
	const { id } = req.params;
	try {
		if (id === '68728251b003a6f29d060bf4') {
			return res
				.status(403)
				.json({ error: 'No está permitido modificar al usuario administrador root' });
		}
		const { password, correo, ...resto } = req.body;
		if (password) {
			const salt = bcrypt.genSaltSync(10);
			resto.password = bcrypt.hashSync(password, salt);
		}
		resto.correo = correo;
		const updated = await Usuario.findByIdAndUpdate(id, resto, { new: true });
		if (!updated) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		const userObj = updated.toObject();
		userObj.id = userObj._id;
		delete userObj._id;
		delete userObj.password;
		return res.json({ data: userObj });
	} catch (err) {
		console.error('Error en usuarioPut:', err);
		return res.status(500).json({ error: 'Error interno al actualizar usuario' });
	}
};

const usuarioDelete = async (req = request, res = response) => {
	const { id } = req.params;
	try {
		if (id === '68728251b003a6f29d060bf4') {
			return res
				.status(403)
				.json({ error: 'No está permitido eliminar al usuario administrador root' });
		}
		const updated = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
		if (!updated) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		const userObj = updated.toObject();
		userObj.id = userObj._id;
		delete userObj._id;
		delete userObj.password;
		return res.json({ data: userObj });
	} catch (err) {
		console.error('Error en usuarioDelete:', err);
		return res.status(500).json({ error: 'Error interno al eliminar usuario' });
	}
};

module.exports = {
	usuarioGet,
	usuarioGetID,
	usuarioPost,
	usuarioPut,
	usuarioDelete,
};
