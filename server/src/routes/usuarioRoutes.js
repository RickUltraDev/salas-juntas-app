/* Imports necesarios */
const express = require('express');
const router = express.Router();

/* Controller */
const usuarioController = require('../controllers/usuarioController');

/* Rutas registradas */
router.post("/registro", usuarioController.registrarUsuario); 
router.get("/", usuarioController.getUsuarios);


module.exports = router;