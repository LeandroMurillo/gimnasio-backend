const Plan = require('../models/planes');

const obtenerPlanes = async (req, res) => {
	try {
		const planes = await Plan.find().lean();
		res.json(planes);
	} catch (error) {
		console.error('Error al obtener planes:', error);
		res.status(500).json({ msg: 'Error interno al obtener los planes' });
	}
};

module.exports = {
	obtenerPlanes,
};
