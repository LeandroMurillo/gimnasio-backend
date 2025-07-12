const { Router } = require('express');
const { registrarAsistencia } = require('../controllers/asistencias');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', validarJWT, registrarAsistencia);

module.exports = router;
