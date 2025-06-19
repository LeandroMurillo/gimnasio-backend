const express = require('express');
const router = express.Router();
const { crearPreferencia } = require('../controllers/pagos');

router.post('/crear-preferencia', crearPreferencia);

module.exports = router;
