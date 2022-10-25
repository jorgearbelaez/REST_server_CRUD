const Role = require("../models/role");
const Usuario = require("../models/usuario");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`el rol ${rol} no esta registrado en la base de datos`);
  }
};

const existeEmail = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`el correo ${correo} ya esta registrado`);
  }
};
const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`el id no existe ${id}`);
  }
};

/* categorias */
const existeCategoria = async (id) => {
  const categoria = await Categoria.findById(id);
  if (!categoria) {
    throw new Error("Categoria no existente en DB");
  }

  if (!categoria.estado) {
    throw new Error("Categoria no existente - estado:false");
  }
};

/* producto */
const existeProducto = async (id) => {
  const producto = await Producto.findById(id);
  if (!producto) {
    throw new Error("Producto no existente en DB");
  }

  if (!producto.estado) {
    throw new Error("Producto no existente - estado:false");
  }
};
/*  Validar colecciones */

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida, -${colecciones}`
    );
  }
  return true;
};

module.exports = {
  esRolValido,
  existeEmail,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto,
  coleccionesPermitidas,
};
