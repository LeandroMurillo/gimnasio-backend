const Categoria = require('../models/categoria');

exports.listarCategorias = async (_, res) => {
	const categorias = await Categoria.find({ estado: true }).select('nombre color');
	res.json(categorias);
};
