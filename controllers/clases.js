const Clase = require('../models/clases');
const Asistencia = require('../models/asistencias');
const Pago = require('../models/pagos');
const Usuario = require('../models/usuarios');
const Plan = require('../models/planes');

exports.obtenerClases = async (req, res) => {
	const { start, end } = req.query;

	// Si viene del calendario (con filtros de fechas)
	if (start && end) {
		try {
			const clases = await Clase.find({
				fechaInicio: { $lt: new Date(end) },
				fechaFin: { $gt: new Date(start) },
			})
				.populate('instructor', 'nombre apellido')
				.lean();

			const counts = await Asistencia.aggregate([
				{ $match: { clase: { $in: clases.map((c) => c._id) } } },
				{ $group: { _id: '$clase', total: { $sum: 1 } } },
			]);

			const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.total]));

			const eventos = clases.map((c) => ({
				id: c._id.toString(),
				title: c.nombre,
				start: c.fechaInicio,
				end: c.fechaFin,
				backgroundColor: c.color ?? '#0d6efd',
				extendedProps: {
					cupoMax: c.cupoMax,
					asistentes: countMap[c._id.toString()] ?? 0,
					instructor: c.instructor,
				},
			}));

			return res.json(eventos);
		} catch (error) {
			console.error('Error al obtener clases filtradas:', error);
			return res.status(500).json({ msg: 'Error al obtener clases con fechas' });
		}
	}

	// Si viene desde React-Admin: sin paginación, ordenadas por fechaInicio descendente
	try {
		const clases = await Clase.find()
			.sort({ fechaInicio: -1 }) // más reciente primero
			.populate('instructor', 'nombre apellido')
			.lean();

		const clasesConId = clases.map((clase) => ({
			...clase,
			id: clase._id.toString(),
		}));

		res.set('Content-Range', `clases 0-${clasesConId.length - 1}/${clasesConId.length}`);
		res.set('Access-Control-Expose-Headers', 'Content-Range');

		return res.json(clasesConId);
	} catch (error) {
		console.error('Error al obtener clases:', error);
		return res.status(500).json({ msg: 'Error interno al obtener clases' });
	}
};

exports.obtenerClasePorId = async (req, res) => {
	try {
		const { id } = req.params;
		const clase = await Clase.findById(id).populate('instructor', 'nombre apellido');

		if (!clase) {
			return res.status(404).json({ msg: 'Clase no encontrada' });
		}

		const claseObj = clase.toObject();
		claseObj.id = clase._id.toString();
		delete claseObj._id;
		delete claseObj.__v;

		res.json(claseObj);
	} catch (err) {
		console.error('Error al obtener clase por ID:', err);
		res.status(500).json({ msg: 'Error al obtener la clase' });
	}
};

exports.crearClase = async (req, res) => {
	try {
		const { nombre, fechaInicio, fechaFin, cupoMax } = req.body;

		if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
			return res.status(400).json({ msg: 'El nombre de la clase es obligatorio' });
		}

		if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
			return res
				.status(400)
				.json({ msg: 'La fecha de fin debe ser posterior a la fecha de inicio' });
		}

		if (cupoMax !== undefined && (isNaN(cupoMax) || cupoMax <= 0)) {
			return res.status(400).json({ msg: 'El cupo máximo debe ser mayor que cero' });
		}

		const clase = new Clase({
			...req.body,
			cupoMax: cupoMax ?? 30,
		});

		await clase.save();

		const claseObj = clase.toObject();
		claseObj.id = clase._id.toString();
		delete claseObj._id;
		delete claseObj.__v;

		res.status(201).json(claseObj);
	} catch (err) {
		console.error('Error al crear clase:', err);
		res.status(400).json({ msg: 'Error al crear clase', err });
	}
};

exports.actualizarClase = async (req, res) => {
	const { id } = req.params;
	const { nombre, fechaInicio, fechaFin, cupoMax } = req.body;

	if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
		return res.status(400).json({ msg: 'El nombre de la clase es obligatorio' });
	}

	if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
		return res.status(400).json({ msg: 'La fecha de fin debe ser posterior a la fecha de inicio' });
	}

	if (cupoMax !== undefined && (isNaN(cupoMax) || cupoMax <= 0)) {
		return res.status(400).json({ msg: 'El cupo máximo debe ser mayor que cero' });
	}

	try {
		const clase = await Clase.findByIdAndUpdate(
			id,
			{ ...req.body, cupoMax: cupoMax ?? 30 },
			{ new: true },
		);

		if (!clase) {
			return res.status(404).json({ msg: 'No existe' });
		}

		const claseObj = clase.toObject();
		claseObj.id = clase._id.toString();
		delete claseObj._id;
		delete claseObj.__v;

		res.json(claseObj);
	} catch (err) {
		console.error('Error al actualizar clase:', err);
		res.status(400).json(err);
	}
};

exports.eliminarClase = async (req, res) => {
	try {
		const clase = await Clase.findByIdAndDelete(req.params.id);
		if (!clase) {
			return res.status(404).json({ msg: 'Clase no encontrada' });
		}
		await Asistencia.deleteMany({ clase: req.params.id });
		res.status(204).end();
	} catch (err) {
		console.error('Error al eliminar clase:', err);
		res.status(400).json({ msg: 'Error al eliminar clase', err });
	}
};

exports.obtenerClasesCards = async (req, res) => {
	try {
		const clases = await Clase.find({}, 'nombre').sort({ createdAt: -1 }).limit(3).lean();

		const resultado = clases.map((c) => ({
			id: c._id.toString(),
			nombre: c.nombre,
		}));

		return res.json(resultado);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ msg: 'Error al obtener datos de tarjetas' });
	}
};

exports.obtenerAsistentesDeClase = async (req, res) => {
	const { id } = req.params;

	try {
		const asistencias = await Asistencia.find({ clase: id }).populate('usuario');

		const pagos = await Pago.find({
			usuario: { $in: asistencias.map((a) => a.usuario._id) },
			status: 'approved',
		})
			.sort({ captured_at: -1 })
			.lean();

		const planPorUsuario = {};
		for (const pago of pagos) {
			if (!planPorUsuario[pago.usuario.toString()]) {
				planPorUsuario[pago.usuario.toString()] = pago.plan;
			}
		}

		const planes = await Plan.find({
			_id: { $in: Object.values(planPorUsuario) },
		}).lean();

		const planInfo = Object.fromEntries(planes.map((p) => [p._id.toString(), p.nombre]));

		const resultado = asistencias.map((a) => ({
			id: a._id.toString(),
			nombre: a.usuario.nombre,
			apellido: a.usuario.apellido,
			email: a.usuario.correo,
			plan: {
				nombre: planInfo[planPorUsuario[a.usuario._id.toString()]] ?? 'Sin plan',
			},
		}));

		res.json(resultado);
	} catch (err) {
		console.error('Error al obtener asistentes:', err);
		res.status(500).json({ msg: 'Error al obtener asistentes de la clase' });
	}
};
