-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: salasjuntasdb
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `muestrareservaciones`
--

DROP TABLE IF EXISTS `muestrareservaciones`;
/*!50001 DROP VIEW IF EXISTS `muestrareservaciones`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `muestrareservaciones` AS SELECT 
 1 AS `idReservacion`,
 1 AS `fecha`,
 1 AS `hora_inicial`,
 1 AS `hora_final`,
 1 AS `num_asistentes`,
 1 AS `asunto`,
 1 AS `estado`,
 1 AS `nombre_reserva`,
 1 AS `nombre_sala`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `reservacion`
--

DROP TABLE IF EXISTS `reservacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservacion` (
  `idReservacion` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora_inicial` time NOT NULL,
  `hora_final` time NOT NULL,
  `num_asistentes` int(11) NOT NULL,
  `asunto` varchar(40) NOT NULL COMMENT 'Ejemplo ''Junta de consejo'', ''Junta con un cliente'', ''Scrum daily coco app''',
  `estado` varchar(2) NOT NULL COMMENT 'ag- agendada, oc - ocupado, li - libre',
  `idUsuario` int(11) NOT NULL,
  `idSala` int(11) NOT NULL,
  PRIMARY KEY (`idReservacion`),
  KEY `fk_reservacion_empleado_idx` (`idUsuario`),
  KEY `fk_reservacion_sala1_idx` (`idSala`),
  CONSTRAINT `fk_reservacion_sala` FOREIGN KEY (`idSala`) REFERENCES `sala` (`idSala`),
  CONSTRAINT `fk_reservacion_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservacion`
--

LOCK TABLES `reservacion` WRITE;
/*!40000 ALTER TABLE `reservacion` DISABLE KEYS */;
INSERT INTO `reservacion` VALUES (1,'2021-01-25','08:00:00','11:00:00',4,'Team Meeting','li',1,1);
/*!40000 ALTER TABLE `reservacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `idSala` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `num_piso` int(11) NOT NULL,
  `capacidad_max` int(11) NOT NULL,
  `hora_disp_inicial` time NOT NULL,
  `hora_disp_final` time NOT NULL,
  `valido` tinyint(4) NOT NULL,
  PRIMARY KEY (`idSala`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES (1,'Everest',1,10,'08:00:00','15:00:00',1),(2,'Picacho',2,15,'10:00:00','20:00:00',1),(3,'Pico de orizaba',2,20,'08:00:00','21:00:00',1),(4,'Era de ultron',5,20,'10:00:00','22:00:00',1);
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `ap_paterno` varchar(60) NOT NULL,
  `ap_materno` varchar(60) NOT NULL,
  `correo` varchar(70) NOT NULL,
  `contrasena` varchar(72) NOT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Ricardo Enrique','Solis','Herrera','rick@gmail.com','\'$2b$10$uMfzArkt2LEfnFRauprj1e5UUztHJLXiwjd7iR6xX1As5cfv.XId6\'');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'salasjuntasdb'
--

--
-- Dumping routines for database 'salasjuntasdb'
--

--
-- Final view structure for view `muestrareservaciones`
--

/*!50001 DROP VIEW IF EXISTS `muestrareservaciones`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `muestrareservaciones` AS select `r`.`idReservacion` AS `idReservacion`,`r`.`fecha` AS `fecha`,`r`.`hora_inicial` AS `hora_inicial`,`r`.`hora_final` AS `hora_final`,`r`.`num_asistentes` AS `num_asistentes`,`r`.`asunto` AS `asunto`,(case `r`.`estado` when 'li' then 'Libre' when 'oc' then 'Ocupada' end) AS `estado`,concat(`u`.`nombre`,' ',`u`.`ap_paterno`,' ',`u`.`ap_materno`) AS `nombre_reserva`,`s`.`nombre` AS `nombre_sala` from ((`reservacion` `r` join `sala` `s` on((`r`.`idSala` = `s`.`idSala`))) join `usuario` `u` on((`r`.`idUsuario` = `u`.`idUsuario`))) where (`s`.`valido` <> 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-25  2:15:30
