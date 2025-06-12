const { response } = require('express');
const Clase = require('../models/Clases');

const crearClase = async (req, res = response) => {
    console.log('Solicitud a /clases recibida');
    const { nombre, fecha, hora, instructor, capacidad } = req.body;

    try {
        const clase = new Clase({ nombre, fecha: new Date(fecha), hora, instructor, capacidad });
        await clase.save();
        res.status(201).json({ message: 'Clase creada', clase });
    } catch (error) {
        console.error('Error en /clases:', error);
        res.status(400).json({ error: error.message });
    }
};

const obtenerClasesDisponibles = async (req, res = response) => {
  try {
    const clases = await Clase.aggregate([
      {
        $match: {
          estado: true,
        },
      },
      {
        $project: {
          nombre: 1,
          fecha: 1,
          hora: 1,
          instructor: 1,
          capacidad: 1,
          inscritos: 1,
          disponible: { $lt: ['$inscritos', '$capacidad'] },
        },
      },
      {
        $match: {
          disponible: true,
        },
      },
    ]);
    res.json({ clases });
  } catch (error) {
    console.error('Error en /clases/disponibles:', error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

module.exports = { crearClase, obtenerClasesDisponibles };