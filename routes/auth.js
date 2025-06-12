console.log('Cargando routes/auth.js'); /* depurar */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { login, register } = require('../controllers/auth');


const router = Router();

router.post(
	'/login',
	[
		check('correo', 'El correo no es válido').isEmail(),
		check('password', 'La contraseña es obligatoria').notEmpty(),
		validarCampos,
	],
	login,
);

/* REGISTRO */
router.post(
  '/register',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido','El apellido es obligatorio' ).notEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La contrasena es obligatoria').notEmpty(),
    check('rol', 'El rol es obligatorio').notEmpty(),
    validarCampos,
  ],
  register
);

module.exports = router;
