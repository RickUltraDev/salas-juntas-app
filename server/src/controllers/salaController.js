/* Imports necesarios */
const dbpool = require('../config/database');

/* Nota: Todas las funciones que hará el controlador serán asincronas */

/* Función para mostrar todas las salas registradas */
async function getSalas(req, res) {
    var salas = null;
    try {
        dbpool.getConnection(function (err, connection) {
            dbpool.query("SELECT * FROM sala WHERE valido != 0", function (
                err,
                results
            ) {
                salas = results;
                if (salas != null) {
                    res.status(200).send({
                        message: "Encontradas",
                        JsonArray: salas
                    });
                } else {
                    res.status(404).send({
                        message: "No Encontradas",
                        JsonArray: salas
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

/* Función para mostrar una sala registrada */
async function getSala(req, res){
    const { idSala } = req.params;
    var sala = null;
    try {
        dbpool.getConnection(function (err, connection) {
            dbpool.query("SELECT * FROM sala WHERE valido != 0 AND idSala = ?", idSala, function (
                err,
                results
            ) {
                sala = results[0];
                if (sala != null) {
                    res.status(200).send({
                        message: "Encontrada",
                        Json: sala
                    });
                } else {
                    res.status(404).send({
                        message: "No Encontrada",
                        Json: sala
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

/* Función para registrar una sala */
async function registrarSala(req, res){
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

                let sala = {
                    nombre: req.body.nombre,
                    num_piso: req.body.num_piso,
                    valido: 1
                };


                connection.query("INSERT INTO sala SET ?", sala, function (err, result) {
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
                                message: "Sala registrada"
                            });
                        }
                    });

                }); //fin query
            }

        }); //fin conexión

    });
}

/* Función para dar de baja logica de sala especifica */
async function eliminarSala(req, res){
   //id del bufete a eliminar
   const { idSala } = req.params;

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

                connection.query("UPDATE sala SET valido = 0 WHERE idSala = ?", idSala, function (err, result) {
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
                                message: "Sala dada de baja"
                            });
                        }

                    });

                }); //fin query
            }

        }); //fin conexión

    });
}

/* Función para actualizar la información de una sala especifica */
async function actualizarSala(req, res){
    //id del bufete a actualizar
    const { idSala } = req.params;


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

               
                let sala = {
                    nombre: req.body.nombre,
                    num_piso: req.body.num_piso,
                    valido: 1
                };

                connection.query("UPDATE sala SET ? WHERE idSala = ?", [sala, idSala], function (err, result) {
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
                                message: "Sala actualizada"
                            });
                        }

                    });

                }); //fin query
            }

        }); //fin conexión

    });
}

module.exports = {
    getSalas, 
    getSala, 
    registrarSala, 
    eliminarSala,
    actualizarSala
}
