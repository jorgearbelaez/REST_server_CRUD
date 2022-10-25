const express = require("express");
const cors = require("cors");

const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
      usuarios: "/api/usuarios",
      uploads: "/api/uploads",
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

    //Carga de archivos - fileupload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.path.auth, require("../routes/auth"));
    this.app.use(this.path.buscar, require("../routes/buscar"));
    this.app.use(this.path.categorias, require("../routes/categorias"));
    this.app.use(this.path.productos, require("../routes/productos"));
    this.app.use(this.path.usuarios, require("../routes/usuarios"));
    this.app.use(this.path.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
