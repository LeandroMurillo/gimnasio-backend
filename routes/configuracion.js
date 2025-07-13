const { Router } = require('express');
const { obtenerConfiguracion, actualizarConfiguracion } = require('../controllers/configuracion');

const router = Router();

router.get('/:id', obtenerConfiguracion); // id = 'default'
router.put('/:id', actualizarConfiguracion);

module.exports = router;
