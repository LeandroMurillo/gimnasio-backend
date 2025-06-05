const Usuario = require('../models/usuarios');
// const Rol = require('../models/rols');
// const Categoria = require('../models/categorias');
// const Curso = require('../models/cursos');

// Validar email o correo
const emailExiste = async (correo) => {
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		throw new Error(`El correo ${correo} ya se encuentra en la base de datos`);
	}
};

// Validar Rol (desactivado por ahora)
/*
const esRolValido = async (rol) => {
	const existeRol = await Rol.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no existe en la base de datos`);
	}
};
*/

// Validar si el usuario con id pasado existe
const usuarioExiste = async (id) => {
	const existeUsuario = await Usuario.findById(id);
	if (!existeUsuario) {
		throw new Error(`El id ${id} no corresponde a ningún usuario registrado`);
	}
};

// Validar si la categoría del curso existe (desactivado)
/*
const categoriaExiste = async (id) => {
	const existeCategoria = await Categoria.findById(id);
	if (!existeCategoria) {
		throw new Error(`El id ${id} no corresponde a ninguna categoría registrada`);
	}
};
*/

// Validar si el curso existe (desactivado)
/*
const cursoExiste = async (id) => {
	const existeCurso = await Curso.findById(id);
	if (!existeCurso) {
		throw new Error(`El id ${id} no corresponde a ningún curso registrado`);
	}
};
*/

module.exports = {
	emailExiste,
	// esRolValido,
	usuarioExiste,
	// categoriaExiste,
	// cursoExiste,
};
