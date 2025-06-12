const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3000;
		// Rutas de la aplicación
		this.authPath = '/api/auth';
		this.usuariosPath = '/api/usuarios';
		this.turnosPath = '/api/turnos'; /* NUEVO */
		this.clasesPath = '/api/clases';

		//Conectar con Base de datos
		/* this.conectarDB(); */

		//Middlewares
		this.middlewares();

		//Función para las rutas
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		//CORS
		/*  this.app.use(cors({
            origin: 'https://tu-frontend.netlify.app',
            credentials: true // necesario para que mande cookies
        })); */
		this.app.use(cors());

		//Leer lo que el usuario envía por el cuerpo de la petición
		this.app.use(express.json());

		//Definir la carpeta pública
		this.app.use(express.static('public'));
	}

	routes() {
		console.log('Cargando rutas en server.js'); // Depuración
		this.app.use(this.usuariosPath, require('../routes/usuarios'));
		this.app.use(this.authPath, require('../routes/auth'));
		this.app.use(this.clasesPath, require('../routes/clases'));
		this.app.use(this.turnosPath, require('../routes/turnos')); /* NUEVO */
	}

	listen() {
		this.conectarDB();
		this.app.listen(this.port, () => {
			console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`);
		});
	}
}

module.exports = Server;