const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path = {
      usuarios: "/api/usuarios",
      auth: "/api/auth",
      categorias: "/api/categorias",
    };

    //conectar a basede datos
    this.conectarDB();

    //middlewares
    this.middlewares();

    //rutas de mi aplicacion

    this.routes();
  }
  async conectarDB() {
    await dbConnection();
  }
  middlewares() {
    // CORS
    this.app.use(cors());

    // lectura y parseo del body

    this.app.use(express.json());

    //directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.path.auth, require("../routes/auth"));
    this.app.use(this.path.usuarios, require("../routes/usuarios"));
    this.app.use(this.path.categorias, require("../routes/categorias"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
