const express = require('express');
const router = express.Router();

const {
	obtenerClases,
	crearClase,
	actualizarClase,
	eliminarClase,
	obtenerClasesCards,
} = require('../controllers/clases');

router.get('/', obtenerClases);

router.post('/', crearClase);

router.put('/:id', actualizarClase);

router.delete('/:id', eliminarClase);

router.get('/ultimas', obtenerClasesCards);

module.exports = router;
