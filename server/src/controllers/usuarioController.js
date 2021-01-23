/* Imports necesarios */
const dbpool = require('../config/database');
const bcrypt = require('bcrypt'); 
const saltRounds = 10;

/* Nota: Todas las funciones que hará el controlador serán asincronas */

/* Función para registrar un usuario */
async function registrarUsuario(req, res){
    dbpool.getConnection(function (err, connection) {
        /* Begin transaction */
        connection.beginTransaction(function (err) {
            if (err) {
                console.log("Error " + err);
                connection.rollback(function () {
                    connection.release();
                    //Failure
                    res.status(500).send({
                        message: "Error"
                      });
                });
            } else {

                let usuario = {
                    nombre: req.body.nombre,
                    ap_paterno: req.body.ap_paterno,
                    ap_materno: req.body.ap_materno,
                    correo: req.body.correo,
                    contrasena: req.body.contrasena
                };

                connection.query("SELECT correo FROM usuario WHERE correo = ?", usuario.correo, function (err, result) {

                    if (result.length > 0) {
                      connection.release();
                      res.status(400).send({
                        message: "Correo ya registrado"
                      });
                    } else {
                     bcrypt.hash(req.body.contrasena, saltRounds, function (err, hash) {
                     usuario.contrasena = hash
              
                        if (err) {
                         connection.release();
                         res.status(500).send({
                         message: "Error de hash"
                         });
                        
                        } else {
                            connection.query("INSERT INTO usuario SET ?", usuario, function (err, result) {
                                if (err) {
                                    console.log("Error " + err);
                                    connection.rollback(function () {
                                        connection.release();
                                        //Failure
                                        res.status(500).send({
                                            message: "Error"
                                        });
                                    });
                                }
        
                                connection.commit(function (err) {
                                    if (err) {
                                        console.log("Error " + err);
                                        connection.rollback(function () {
                                            connection.release();
                                            //Failure
                                            res.status(500).send({
                                                message: "Error"
                                            });
                                        });
                                    } else {
                                        connection.release();
                                        //Success
                                        res.status(200).send({
                                            message: "Usuario registrado"
                                        });
                                    }
                                });
        
                            }); //fin query
                        }//fin else hash
                    });
                    
                }

            }); //fin conexión

          }

       });

    });
}

/* Función para buscar un usuario registrado por su correo electronico */
async function buscarUsuario(req, res){
    const { correo } = req.body;
    var usuario = null;
    try {
        dbpool.getConnection(function (err, connection) {
            dbpool.query("SELECT * FROM usuario WHERE correo = ?", correo, function (
                err,
                results
            ) {
                usuario = results[0];
                if (usuario != null) {
                    res.status(200).send({
                        message: "Encontrado",
                        Json: usuario
                    });
                } else {
                    res.status(404).send({
                        message: "No Encontrado",
                        Json: usuario
                    });
                }

                //Cuando termine de hacer su tarea suelta la conexión
                connection.release();
            });
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    registrarUsuario,
    buscarUsuario
}