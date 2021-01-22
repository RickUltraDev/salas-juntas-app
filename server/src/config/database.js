const mysql = require('mysql');
/* Conexiones con mysql */
/* Agrupación de conexiones */
var pool = mysql.createPool({
    connectionLimit : 100, 
    host: 'localhost', 
    user: 'root',
    password:'password',
    database: 'salasjuntasdb',
    port: 3306
}
);

/* Checar conexión*/
pool.getConnection(function(err, connection) {
if (err) {
  console.error('Error conectando: '+err.stack);
  return;
}
console.log('BD '+connection.state);
});


module.exports = pool;
