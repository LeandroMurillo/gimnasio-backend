const Clase = require('../models/clases');
const Asistencia = require('../models/asistencias');

exports.obtenerClases = async (req, res) => {
	const { start, end } = req.query;
	if (!start || !end) {
		return res.status(400).json({ msg: 'start y end requeridos' });
	}

	const clases = await Clase.find({
		fechaInicio: { $lt: new Date(end) },
		fechaFin: { $gt: new Date(start) },
	})
		.populate('categoria', 'nombre color')
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
		backgroundColor: c.categoria?.color ?? '#0d6efd',
		extendedProps: {
			cupoMax: c.cupoMax,
			asistentes: countMap[c._id.toString()] ?? 0,
			planesPermitidos: c.planesPermitidos,
			instructor: c.instructor,
			categoria: c.categoria,
		},
	}));

	res.json(eventos);
};

exports.crearClase = async (req, res) => {
	try {
		const clase = new Clase(req.body);
		await clase.save();
		res.status(201).json(clase);
	} catch (err) {
		res.status(400).json({ msg: 'Error al crear clase', err });
	}
};

exports.actualizarClase = async (req, res) => {
	const { id } = req.params;
	try {
		const clase = await Clase.findByIdAndUpdate(id, req.body, { new: true });
		if (!clase) return res.status(404).json({ msg: 'No existe' });
		res.json(clase);
	} catch (err) {
		res.status(400).json(err);
	}
};

exports.eliminarClase = async (req, res) => {
	await Clase.findByIdAndDelete(req.params.id);
	await Asistencia.deleteMany({ clase: req.params.id });
	res.status(204).end();
};

exports.obtenerClasesCards = async (req, res) => {
	try {
		const clases = await Clase.find({}, 'nombre descripcion imagenUrl')
			.sort({ createdAt: -1 })
			.limit(3)
			.lean();

		const resultado = clases.map((c) => ({
			id: c._id.toString(),
			nombre: c.nombre,
			descripcion: c.descripcion,
			imagenUrl: c.imagenUrl,
		}));

		return res.json(resultado);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ msg: 'Error al obtener datos de tarjetas' });
	}
};
