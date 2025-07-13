const { Router } = require('express');
const { check } = require('express-validator');
const {
	usuarioGet,
	usuarioGetID,
	usuarioPost,
	usuarioDelete,
	usuarioPut,
	obtenerInstructores, // Importamos el controlador para obtener instructores
} = require('../controllers/usuarios');

const { emailExiste, usuarioExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

// Primero definimos la ruta específica para obtener instructores
router.get('/instructores', obtenerInstructores); // Aquí agregamos la ruta para obtener instructores

// Luego las rutas con :id, ya que son rutas dinámicas
router.get('/', usuarioGet);

router.get(
	'/:id',
	[check('id', 'El id no es válido').isMongoId(), check('id').custom(usuarioExiste), validarCampos],
	usuarioGetID,
);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').notEmpty(),
		check('apellido', 'El apellido es obligatorio').notEmpty(),
		check('telefono', 'El teléfono es obligatorio').notEmpty(),
		check('correo').custom(emailExiste),
		check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({ min: 6 }),
		validarCampos,
	],
	usuarioPost,
);

router.put(
	'/:id',
	[check('id', 'No es un ID válido').isMongoId(), check('id').custom(usuarioExiste), validarCampos],
	usuarioPut,
);

router.delete(
	'/:id',
	[check('id', 'No es un ID válido').isMongoId(), check('id').custom(usuarioExiste), validarCampos],
	usuarioDelete,
);

module.exports = router;
