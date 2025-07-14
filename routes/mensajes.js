const { Router } = require('express');
const { obtenerMensajes, crearMensaje, borrarMensaje } = require('../controllers/mensajes');

const router = Router();

router.get('/', obtenerMensajes);
router.post('/', crearMensaje);
router.delete('/:id', borrarMensaje);

module.exports = router;
