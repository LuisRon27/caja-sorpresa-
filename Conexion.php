<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "prueba";

// Crear conexión
$conexion = new mysqli($host, $username, $password, $database);

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

