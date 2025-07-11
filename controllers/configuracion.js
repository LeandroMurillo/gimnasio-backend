const Configuracion = require('../models/configuracion');

const obtenerConfiguracion = async (req, res) => {
	try {
		const config = await Configuracion.findOne();

		if (!config) {
			return res.status(404).json({ error: 'Configuración no encontrada' });
		}

		const obj = config.toObject();
		res.json({
			id: config._id.toString(), // Necesario para React Admin
			nombre: obj.nombre,
			direccion: obj.direccion,
			ciudad: obj.ciudad,
			email: obj.email,
			telefono: obj.telefono,
			whatsapp: obj.whatsapp,
			redes: obj.redes,
			ubicacion: obj.ubicacion,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al obtener la configuración' });
	}
};

const actualizarConfiguracion = async (req, res) => {
	const { id } = req.params;
	const data = req.body;

	try {
		const config = await Configuracion.findByIdAndUpdate(id, data, { new: true });

		if (!config) {
			return res.status(404).json({ error: 'Configuración no encontrada' });
		}

		res.json({
			id: config._id.toString(),
			...config.toObject(),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al actualizar configuración' });
	}
};

module.exports = {
	obtenerConfiguracion,
	actualizarConfiguracion,
};
