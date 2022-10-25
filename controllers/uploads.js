const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");
const { Console } = require("console");

const cargarArchivo = async (req, res = response) => {
  try {
    //txt, md
    // const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({
      nombre,
    });
  } catch (msg) {
    res.status(400).json(msg);
  }
};

const actualizarArchivoCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "No validamos esto" });
  }

  // Limpiar imagenes previas

  if (modelo.img) {
    // obtenemos el public id de cloudinary
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");

    console.log(public_id);
    // borramos de cloudinary
    cloudinary.uploader.destroy(public_id);

    // // borrar imagen del servidor

    // const pathImagen = path.join(
    //   __dirname,
    //   "../uploads",
    //   coleccion,
    //   modelo.img
    // );
    // if (fs.existsSync(pathImagen)) {
    //   fs.unlinkSync(pathImagen);
    // }
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;

  // const nombre = await subirArchivo(req.files, undefined, coleccion);
  // modelo.img = await nombre;

  //guardamos en DB
  await modelo.save();

  res.json(modelo);
};

mostrarImagenes = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "No validamos esto" });
  }

  //verificar que mi modelo tenga la propiedad de imagen

  if (modelo.img) {
    // servir imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  // si no existe la imagen
  const placeHolder = path.join(__dirname, "../assets/no-image.jpg");

  res.sendFile(placeHolder);
};

// const actualizarArchivo = async (req, res = response) => {
//   const { id, coleccion } = req.params;

//   let modelo;

//   switch (coleccion) {
//     case "usuarios":
//       modelo = await Usuario.findById(id);
//       if (!modelo) {
//         return res.status(400).json({
//           msg: `No existe un usuario con el id ${id}`,
//         });
//       }

//       break;
//     case "productos":
//       modelo = await Producto.findById(id);
//       if (!modelo) {
//         return res.status(400).json({
//           msg: `No existe un producto con el id ${id}`,
//         });
//       }

//       break;

//     default:
//       return res.status(500).json({ msg: "No validamos esto" });
//   }

//   //Limpiar imagenes previas

//   if (modelo.img) {
//     // borrar imagen del servidor
//     const pathImagen = path.join(
//       __dirname,
//       "../uploads",
//       coleccion,
//       modelo.img
//     );
//     if (fs.existsSync(pathImagen)) {
//       fs.unlinkSync(pathImagen);
//     }
//   }

//   const nombre = await subirArchivo(req.files, undefined, coleccion);
//   modelo.img = await nombre;

//   await modelo.save();

//   res.json(modelo);
// };
module.exports = {
  cargarArchivo,
  // actualizarArchivo,
  mostrarImagenes,
  actualizarArchivoCloudinary,
};
