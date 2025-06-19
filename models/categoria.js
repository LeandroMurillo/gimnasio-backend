const { Schema, model } = require('mongoose');

const CategoriaSchema = new Schema(
	{
		nombre: { type: String, required: true },
		color: { type: String, required: true },
		estado: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = model('Categoria', CategoriaSchema);
