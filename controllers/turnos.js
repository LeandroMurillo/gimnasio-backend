const { response } = require('express');
const Turno = require('../models/Turno');
const Clase = require('../models/Clases');
const Usuario = require('../models/usuarios');
const { claseDisponible, turnoDuplicado } = require('../helpers/validar-turno');

const reservarTurno = async (req, res = response) => {
  console.log('Solicitud a /reservar recibida');
  const { claseId } = req.body;
  const usuarioId = req.usuario?.id;

  try {
    if (!usuarioId) {
      return res.status(401).json({ msg: 'Usuario no autenticado' });
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario || !usuario.estado) {
      return res.status(400).json({ msg: 'Usuario no válido o inactivo' });
    }

    await claseDisponible(claseId);
    await turnoDuplicado(usuarioId, claseId);

    const turno = new Turno({ usuario: usuarioId, clase: claseId });
    await turno.save();

    await Clase.findByIdAndUpdate(claseId, { $inc: { inscritos: 1 } });

    res.status(201).json({ message: 'Turno reservado', turno });
  } catch (error) {
    console.error('Error en /reservar:', error);
    res.status(400).json({ error: error.message });
  }
};

const obtenerTurnosUsuario = async (req, res = response) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ msg: 'Usuario no autenticado' });
    }

    const turnos = await Turno.find({ usuario: usuarioId, estado: 'reservado' })
      .populate('usuario', 'nombre apellido')
      .populate('clase', 'nombre fecha hora instructor');
    res.json({ turnos });
  } catch (error) {
    console.error('Error en /turnos/usuario:', error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

module.exports = { reservarTurno, obtenerTurnosUsuario };