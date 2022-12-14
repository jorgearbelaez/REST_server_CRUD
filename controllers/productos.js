const { response, request } = require("express");
const { Producto } = require("../models");

// obtenerCategorias - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

// obtenerCategoria - populate{}
const obtenerProducto = async (req = request, res = response) => {
  const id = req.params.id;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);
  //guardar en DB
  await producto.save();

  res.status(201).json(producto);
};

// actualizarCategoria

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { usuario, estado, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  //identificacion del usuario que eta realizando la modificacion
  data.usuario = req.usuario._id;

  //actualizamos el registro
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
};

//borrarCategoria - estado:false
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  //actualizamos el registro
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    producto,
  });
};
module.exports = {
  crearProducto,
  obtenerProducto,
  obtenerProductos,
  actualizarProducto,
  borrarProducto,
};
