const { Router } = require("express");
const { check } = require("express-validator");
const {
  validarJWT,
  validarCampos,
  tieneRole,
  esAdminRole,
} = require("../middlewares");

const {
  categorias,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID de mongo válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);

//Crear categoria - privado - cualquier persona con un token valido

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar - privado- cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar una categoria -Admin

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
