/* Imports necesarios*/
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = express.Router();

/* Middleware -> Configuraciones*/
const app = express();
app.use(morgan("dev")); //Este middleware sirve para ver el estatus de los requests
app.use(cors());

/* Cross origin resourse sharing, es para compartir información entre diferentes dominios */
app.use(cors({ origin: ["http://localhost:4200"], credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

/* Conexion de prueba*/
app.get("/", async (req, res) => {
  res.json({ Mensaje: "Bienvenido al server" });
});

/* Rutas de conexiones */
/* Nota: Todas las rutas tendran un prefijo 'api' que se le añadirá a la ruta */
app.use("/api/reservacion",require("./routes/reservacionRoutes"));

/* Inciar la conexión con el server*/
app.set("port", 3000 | process.env.connection);

/* Puerto para server */
app.listen(app.get("port"), "0.0.0.0", (err) => {
  if (err) {
    console.log("Error en el servidor: " + `${err}`);
  } else {
    console.log("Server on port: " + app.get("port"));
  }
});
