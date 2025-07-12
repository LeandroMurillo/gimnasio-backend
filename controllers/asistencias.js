const Asistencia = require('../models/asistencias');
const Clase = require('../models/clases');
const Usuario = require('../models/usuarios');

exports.registrarAsistencia = async (req, res) => {
	try {
		const { clase: claseId, usuario: usuarioId } = req.body;

		// 1. Obtener clase e incluir planes permitidos
		const clase = await Clase.findById(claseId).populate('planesPermitidos');
		if (!clase) return res.status(404).json({ msg: 'Clase no encontrada' });

		// 2. Obtener usuario con su plan
		const usuario = await Usuario.findById(usuarioId);
		if (!usuario || !usuario.plan)
			return res.status(403).json({ msg: 'El usuario no tiene un plan activo' });

		// 3. Verificar si su plan está permitido
		const planPermitido = clase.planesPermitidos.some(
			(plan) => plan._id.toString() === usuario.plan.toString(),
		);

		if (!planPermitido) {
			return res.status(403).json({
				msg: 'Tu plan no te permite anotarte a esta clase',
			});
		}

		// 4. Verificar si ya se registró
		const yaRegistrado = await Asistencia.findOne({ clase: claseId, usuario: usuarioId });
		if (yaRegistrado) {
			return res.status(400).json({ msg: 'Ya estás anotado en esta clase' });
		}

		// 5. Verificar cupo
		const totalAsistentes = await Asistencia.countDocuments({ clase: claseId });
		if (totalAsistentes >= clase.cupoMax) {
			return res.status(400).json({ msg: 'No hay más cupos disponibles' });
		}

		// 6. Crear la asistencia
		const nuevaAsistencia = new Asistencia({ clase: claseId, usuario: usuarioId });
		await nuevaAsistencia.save();

		return res.status(201).json({ msg: 'Inscripción exitosa' });
	} catch (err) {
		console.error('Error al registrar asistencia:', err);
		return res.status(500).json({ msg: 'Error interno' });
	}
};
