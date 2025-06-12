console.log('Cargando routes/clases.js');
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearClase, obtenerClasesDisponibles } = require('../controllers/clases');

const router = Router();

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').isIn(['yoga', 'zumba', 'spinning', 'boxeo']),
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    check('hora', 'La hora debe ser HH:MM').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('instructor', 'El instructor es obligatorio').notEmpty(),
    check('capacidad', 'La capacidad debe ser mayor a 0').isInt({ min: 1 }),
    validarCampos,
  ],
  crearClase
);

router.get('/disponibles', obtenerClasesDisponibles);

module.exports = router;