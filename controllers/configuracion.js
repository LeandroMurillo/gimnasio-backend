const Configuracion = require('../models/configuracion');

// Obtener configuración
const obtenerConfiguracion = async (req, res) => {
	try {
		const config = await Configuracion.findById('default');
		if (!config) {
			return res.status(404).json({ error: 'Configuración no encontrada' });
		}
		res.json({ id: 'default', ...config.toObject() });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al obtener configuración' });
	}
};

// Actualizar configuración
const actualizarConfiguracion = async (req, res) => {
	try {
		const data = req.body;
		const config = await Configuracion.findByIdAndUpdate('default', data, {
			new: true,
			upsert: true,
		});
		res.json({ id: 'default', ...config.toObject() });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al actualizar configuración' });
	}
};

module.exports = {
	obtenerConfiguracion,
	actualizarConfiguracion,
};
