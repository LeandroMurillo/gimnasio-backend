const Asistencia = require('../models/asistencias');
const Clase = require('../models/clases');

exports.inscribirse = async (req, res) => {
	const { clase: claseId } = req.body;
	const uid = req.usuario._id;

	const clase = await Clase.findById(claseId);
	if (!clase) return res.status(404).json({ msg: 'Clase no existe' });

	const count = await Asistencia.countDocuments({ clase: claseId });
	if (count >= clase.cupoMax) return res.status(409).json({ msg: 'Clase llena' });

	const dup = await Asistencia.findOne({ clase: claseId, usuario: uid });
	if (dup) return res.status(409).json({ msg: 'Ya estás inscrito' });

	const asistencia = await Asistencia.create({
		usuario: uid,
		clase: claseId,
		ingreso: clase.fechaInicio,
	});
	res.status(201).json(asistencia);
};
