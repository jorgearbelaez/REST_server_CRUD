const { response, json } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { password, correo } = req.body;

  try {
    //verificar si email existe

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    //el usuario esta activo?
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos -estado:false",
      });
    }

    // verificar contrasena
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Algo salio mal",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    // verificamos si el correo ya existe en nuestra base de datos
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario esta borrado en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Comunicarse con el administrador, usuario bloqueado",
      });
    }

    //generar el jwt
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
