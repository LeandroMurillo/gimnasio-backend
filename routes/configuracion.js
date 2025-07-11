const { Router } = require('express');
const { obtenerConfiguracion, actualizarConfiguracion } = require('../controllers/configuracion');

const router = Router();

router.get('/', obtenerConfiguracion);
router.put('/:id', actualizarConfiguracion);

module.exports = router;
