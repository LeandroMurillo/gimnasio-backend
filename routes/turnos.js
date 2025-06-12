console.log('Cargando routes/turnos.js');
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { reservarTurno, obtenerTurnosUsuario } = require('../controllers/turnos');

const router = Router();

router.post(
  '/reservar',
  [
    validarJWT,
    check('claseId', 'El ID de la clase es obligatorio').isMongoId(),
    validarCampos,
  ],
  reservarTurno
);

router.get('/usuario', [validarJWT], obtenerTurnosUsuario);

module.exports = router;