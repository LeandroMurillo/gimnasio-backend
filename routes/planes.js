const express = require('express');
const { obtenerPlanes } = require('../controllers/planes');
const router = express.Router();

router.get('/', obtenerPlanes);

module.exports = router;
