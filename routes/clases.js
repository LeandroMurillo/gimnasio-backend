const express = require('express');
const router = express.Router();

const {
	obtenerClases,
	obtenerClasePorId,
	crearClase,
	actualizarClase,
	eliminarClase,
	obtenerClasesCards,
	obtenerAsistentesDeClase,
} = require('../controllers/clases');

router.get('/', obtenerClases);
router.get('/ultimas', obtenerClasesCards);
router.get('/:id', obtenerClasePorId);
router.post('/', crearClase);
router.put('/:id', actualizarClase);
router.delete('/:id', eliminarClase);
router.get('/:id/asistentes', obtenerAsistentesDeClase);

module.exports = router;
