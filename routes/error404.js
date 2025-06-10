const express = require('express');
const router = require('./usuarios');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Bienvenido a la página principal');
});

app.use((req, res) => {
    res.status(404).json({
        error: '404 - Página no encontrada',
        message: 'Lo sentimos, la página que buscas no existe.'
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = router;