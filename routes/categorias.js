const { Router } = require('express');
const ctrl = require('../controllers/categoria');
const router = Router();

router.get('/', ctrl.listarCategorias);
module.exports = router;
