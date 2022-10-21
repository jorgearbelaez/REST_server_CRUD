const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares");

const { categorias } = require("../controllers/categorias");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", (req, resp) => {
  resp.json("get");
});

//obtener una categoria por id - publico
router.get("/:id", (req, resp) => {
  resp.json("get - id");
});

//Crear categoria - privado - cualquier persona con un token valido

router.post("/", [validarJWT], (req, resp) => {
  resp.json("post");
});

//Actualizar - privado- cualquiera con token valido
router.put("/:id", (req, resp) => {
  resp.json("put");
});

// Borrar una categoria -Admin

router.delete("/:id", (req, resp) => {
  resp.json("delete");
});

module.exports = router;
