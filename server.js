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
		// this.clasesPath = '/api/clases';
		this.error404Path = '/api/error404'

		//Conectar con Base de datos
		this.conectarDB();

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
		this.app.use(this.usuariosPath, require('../routes/usuarios'));
		this.app.use(this.authPath, require('../routes/auth'));
		this.app.use(this.error404Path, require('../routes/error404'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`);
		});
	}
}

module.exports = Server;