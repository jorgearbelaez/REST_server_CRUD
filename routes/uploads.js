const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarArchivo,
  mostrarImagenes,
  actualizarArchivoCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
const validarArchivoSubir = require("../middlewares/validar-archivo");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser de mongoDB").isMongoId(),

    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarArchivoCloudinary
);
router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de mongoDB").isMongoId(),

    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],

  mostrarImagenes
);

module.exports = router;
