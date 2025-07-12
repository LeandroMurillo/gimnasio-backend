const express = require('express');
const router = express.Router();
const { crearPreferencia, registrarPago } = require('../controllers/pagos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/crear-preferencia', validarJWT, crearPreferencia);
router.post('/', validarJWT, registrarPago);

module.exports = router;
