/* Imports necesarios */
const dbpool = require('../config/database');

/* Nota: Todas las funciones que hará el controlador serán asincronas */

/* Función para mostrar todas las reservaciones de salas realizadas */
async function getReservaciones(req, res) {
    var reservaciones = null;
    try {
        dbpool.getConnection(function (err, connection) {
            dbpool.query("SELECT * FROM muestrareservaciones", function (
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
            dbpool.query("SELECT * FROM reservacion WHERE idReservacion = ?", idReservacion, function (
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

                const { correoUsuario } = req.body;
                let reservacion = {
                    fecha: req.body.fecha,
                    hora_inicial: req.body.hora_inicial,
                    hora_final: req.body.hora_final,
                    num_asistentes: req.body.num_asistentes,
                    asunto: req.body.asunto,
                    estado: 'oc',
                    idUsuario: null,
                    idSala: req.body.idSala
                };

                let horaFin = (new Date(reservacion.fecha+" "+reservacion.hora_final)).getTime();
                let horaIn = (new Date(reservacion.fecha+" "+reservacion.hora_inicial)).getTime();
        
                let tiempoReser = horaFin - horaIn;
                
                if(tiempoReser < 0 ){
                    connection.release();
                    res.status(400).send({
                    message: "Horario mal ingresado"
                    });
                }else if(tiempoReser > 7200000){
                    connection.release();
                     res.status(400).send({
                     message: "Horario excedido de dos horas"
                     });
                }else{

                    connection.query("SELECT hora_inicial, hora_final, estado FROM reservacion WHERE fecha = ?"+
                    " AND idSala = ?", [reservacion.fecha, reservacion.idSala], function (err, resultBusq) {

                        if (resultBusq.length > 0) {
                            let horaFin = (new Date(reservacion.fecha+" "+reservacion.hora_final)).getTime();
                            let horaIn = (new Date(reservacion.fecha+" "+reservacion.hora_inicial)).getTime();
                            let horaFinBusq = (new Date(reservacion.fecha+" "+resultBusq[resultBusq.length-1].hora_final)).getTime();
                            let horaInBusq = (new Date(reservacion.fecha+" "+resultBusq[resultBusq.length-1].hora_inicial)).getTime();
                            
                            if (resultBusq[0].estado === 'oc' || horaIn === horaInBusq 
                            || horaIn > horaInBusq && horaIn < horaFinBusq ||
                                horaFin > horaInBusq && horaFin < horaFinBusq){
                                connection.release();
                                res.status(400).send({
                                message: "Sala ocupada a la hora elegida"});
                                
                                }else{
                                    connection.query("SELECT idUsuario FROM usuario WHERE correo = ?", correoUsuario, function (err, resultBD) {
                                        if (resultBD.length > 0) {
                                            reservacion.idUsuario = resultBD[0].idUsuario;
                
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
                                            message: "No existe el correo del usuario"
                                            });
                                        }
                                    }); //fin query 1
                                
                                }

                            }else{
                                connection.query("SELECT idUsuario FROM usuario WHERE correo = ?", correoUsuario, function (err, resultBD) {
                                    if (resultBD.length > 0) {
                                        reservacion.idUsuario = resultBD[0].idUsuario;
            
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
                                        message: "No existe el correo del usuario"
                                        });
                                    }
                                }); //fin query 1
                            }
                        });

                }
               
            }

        }); //fin conexión

    });
}

/* Función para dar de baja fisica una reservacion de una sala especifica */
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

                connection.query("DELETE FROM reservacion WHERE idReservacion = ?", idReservacion, function (err, result) {
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

                const { correoUsuario } = req.body;
                let reservacion = {
                    fecha: req.body.fecha,
                    hora_inicial: req.body.hora_inicial,
                    hora_final: req.body.hora_final,
                    num_asistentes: req.body.num_asistentes,
                    asunto: req.body.asunto,
                    idUsuario: req.body.idUsuario,
                    idSala: req.body.idSala
                };

                let horaFin = (new Date(reservacion.fecha+" "+reservacion.hora_final)).getTime();
                let horaIn = (new Date(reservacion.fecha+" "+reservacion.hora_inicial)).getTime();
        
                let tiempoReser = horaFin - horaIn;
                
                if(tiempoReser < 0 ){
                    connection.release();
                    res.status(400).send({
                    message: "Horario mal ingresado"
                    });
                }else if(tiempoReser > 7200000){
                    connection.release();
                     res.status(400).send({
                     message: "Horario excedido de dos horas"
                     });
                }else{

                    connection.query("SELECT hora_inicial, hora_final FROM reservacion WHERE fecha = ?"+
                    " AND idSala = ?", [reservacion.fecha, reservacion.idSala], function (err, resultBusq) {

                        if (resultBusq.length > 0) {
                            let horaFin = (new Date(reservacion.fecha+" "+reservacion.hora_final)).getTime();
                            let horaIn = (new Date(reservacion.fecha+" "+reservacion.hora_inicial)).getTime();
                            let horaFinBusq = (new Date(reservacion.fecha+" "+resultBusq[resultBusq.length-1].hora_final)).getTime();
                            let horaInBusq = (new Date(reservacion.fecha+" "+resultBusq[resultBusq.length-1].hora_inicial)).getTime();
                           
                            if (horaIn === horaInBusq || horaIn > horaInBusq && horaIn < horaFinBusq ||
                                horaFin > horaInBusq && horaFin < horaFinBusq){
                                connection.release();
                                res.status(400).send({
                                message: "Sala ocupada a la hora elegida"});
                                
                                }else{
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
                
                                }

                            }else{
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
            
                                    
                            }
                        });

                }
               
            }

        }); //fin conexión

    });
}

/* Función para finalizar una reservacion de una sala especifica */
async function finalizarReservacion(req, res){
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
                connection.query("UPDATE reservacion SET estado = 'li' WHERE idReservacion = ?",  idReservacion, function (err, result) {
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
                                message: "Reservacion finalizada"
                            });
                        }

                    });

                }); //fin query
            }

        }); //fin conexión

    });
}

module.exports = {
    getReservaciones,
    getReservacion,
    registrarReservacion,
    eliminarReservacion,
    actualizarReservacion, 
    finalizarReservacion
}