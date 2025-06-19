const { Router } = require('express');
const validarJWT = require('../middlewares/validar-jwt');
const ctrl = require('../controllers/asistencia');

const router = Router();
router.post('/', validarJWT, ctrl.inscribirse);
module.exports = router;
