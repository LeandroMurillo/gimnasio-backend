const Turno = require('../models/Turno');
const Clase = require('../models/Clases');

const claseDisponible = async (claseId) => {
    const clase = await Clase.findById(claseId);
    if (!clase || !clase.estado) {
        throw new Error('Clase no disponible');
    };
    if (clase.inscritos >= clase.capacidad) {
        throw new Error('Cupo completo');
    }
    return true;
};

const turnoDuplicado = async (usuarioId, claseId) => {
    const turnoExistente = await Turno.findOne({
        usuario: usuarioId,
        clase: claseId,
        estado: 'reservado',
    });
    if (turnoExistente) {
        throw new Error('Ya tienes un turno reservado para esta clase');
    }
    return true;
};

const planCompatible = (planUsuario, actividad) => {
    if (planUsuario !== 'full' && plaUsuario !== actividad) {
        throw new Error('El plan no permite esta actividad');
    }
    return true;
};

module.exports = { claseDisponible, turnoDuplicado };