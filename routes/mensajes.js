const { Router } = require('express');
const { obtenerMensajes, crearMensaje, borrarMensaje } = require('../controllers/mensajes');

const router = Router();

router.get('/', obtenerMensajes);        // Para admin
router.post('/', crearMensaje);          // Desde frontend
router.delete('/:id', borrarMensaje);    // Para react-admin opcional

module.exports = router;
