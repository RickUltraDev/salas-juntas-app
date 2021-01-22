/* Imports necesarios */
const dbpool = require('../config/database');

/* Nota: Todas las funciones que hará el controlador serán asincronas */

/* Función para mostrar todas las reservaciones de salas realizadas */
async function getReservaciones(req, res) {
    var reservaciones = null;
    try {
        dbpool.getConnection(function (err, connection) {
            dbpool.query("SELECT * FROM reservacion WHERE valido != 0", function (
                err,
                results
            ) {
                reservaciones = results;
                if (reservaciones != null) {
                    res.status(200).send({
                        message: "Encontradas",
                        JsonArray: reservaciones
                    });
                } else {
                    res.status(404).send({
                        message: "No Encontradas",
                        JsonArray: reservaciones
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

/* Función para mostrar una reservacion de una sala especifica */
async function getReservacion(req, res) {
    const { idReservacion } = req.params;
    var reservacion = null;
    try {
        dbpool.getConnection(function (err, connection) {
            dbpool.query("SELECT * FROM reservacion WHERE valido != 0 AND idReservacion = ?", idReservacion, function (
                err,
                results
            ) {
                reservacion = results[0];
                if (reservacion != null) {
                    res.status(200).send({
                        message: "Encontrada",
                        Json: reservacion
                    });
                } else {
                    res.status(404).send({
                        message: "No Encontrada",
                        Json: reservacion
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

/* Función para registrar una reservacion de una sala especifica */
async function registrarReservacion(req, res) {
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

                const { correo } = req.body;
                let reservacion = {
                    num_sala: req.body.num_sala,
                    fecha: req.body.fecha,
                    hora_inicial: req.body.hora_inicial,
                    hora_final: req.body.hora_final,
                    num_asistentes: req.body.num_asistentes,
                    estado: 'ag',
                    valido: 1,
                    idEmpleado: null
                };

                connection.query("SELECT idEmpleado FROM empleado WHERE correo = ?", correo, function (err, resultBD) {
                    if (resultBD.length > 0) {
                        reservacion.idEmpleado = resultBD[0].idEmpleado;

                        connection.query("INSERT INTO reservacion SET ?", reservacion, function (err, result) {
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
                                        message: "Reservacion creada"
                                    });
                                }
                            });
        
                        }); //fin query 2

                    }else{
                       connection.release();
                        res.status(404).send({
                        message: "No existe el correo"
                        });
                    }
                }); //fin query 1
               
            }

        }); //fin conexión

    });
}

/* Función para dar de baja logica una reservacion de una sala especifica */
async function eliminarReservacion(req, res) {
    
    const { idReservacion } = req.params;

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

                connection.query("UPDATE reservacion SET valido = 0 WHERE idReservacion = ?", idReservacion, function (err, result) {
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
                                message: "Reservacion dada de baja"
                            });
                        }

                    });

                }); //fin query
            }

        }); //fin conexión

    });
}

/* Función para actualizar los datos de una reservacion de una sala especifica */
async function actualizarReservacion(req, res) {
    const { idReservacion } = req.params;
 
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

                const { correo } = req.body;
                let reservacion = {
                    num_sala: req.body.num_sala,
                    fecha: req.body.fecha,
                    hora_inicial: req.body.hora_inicial,
                    hora_final: req.body.hora_final,
                    num_asistentes: req.body.num_asistentes,
                    valido: 1,
                    idEmpleado: null
                };

                connection.query("SELECT idEmpleado FROM empleado WHERE correo = ?", correo, function (err, resultBD) {
                    if (resultBD.length > 0) {
                        reservacion.idEmpleado = resultBD[0].idEmpleado;

                        connection.query("UPDATE reservacion SET ? WHERE idReservacion = ?", [reservacion, idReservacion], function (err, result) {
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
                                        message: "Reservacion actualizada"
                                    });
                                }
                            });
        
                        }); //fin query 2

                    }else{
                       connection.release();
                        res.status(404).send({
                        message: "No existe el correo"
                        });
                    }
                }); //fin query 1
               
            }

        }); //fin conexión

    });
}

module.exports = {
    getReservaciones,
    getReservacion,
    registrarReservacion,
    eliminarReservacion,
    actualizarReservacion
}