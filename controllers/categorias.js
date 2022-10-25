const { response, request } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

// obtenerCategoria - populate{}
const obtenerCategoria = async (req = request, res = response) => {
  const id = req.params.id;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json(categoria);
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);
  //guardar en DB
  await categoria.save();

  res.status(201).json(categoria);
};

// actualizarCategoria

const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, usuario, estado, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  //identificacion del usuario que eta realizando la modificacion
  data.usuario = req.usuario._id;

  //actualizamos el registro
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json(categoria);
};

//borrarCategoria - estado:false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  //actualizamos el registro
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  console.log(categoria);
  res.json({
    categoria,
  });
};
module.exports = {
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
  actualizarCategoria,
  borrarCategoria,
};
