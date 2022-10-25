const { Router } = require("express");
const { check } = require("express-validator");
const {
  validarJWT,
  validarCampos,
  tieneRole,
  esAdminRole,
} = require("../middlewares");

const {
  crearProducto,
  obtenerProducto,
  obtenerProductos,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const { existeProducto, existeCategoria } = require("../helpers/db-validators");

const router = Router();

// Obtener todos los productos - publico
router.get("/", obtenerProductos);

// obtener un producto por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID de mongo válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

// Crear producto - privado - cualquier persona con un token valido

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de mongodb").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

// Actualizar - privado- cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    // check("categoria", "No es un id de mongodb").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto
);

// Borrar un producto -Admin

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
