<?php
$host = "localhost"; // Cambia según tu configuración
$username = "root"; // Cambia según tu configuración
$password = ""; // Cambia según tu configuración
$database = "prueba"; // Cambia según tu configuración

// Crear conexión
$conexion = new mysqli($host, $username, $password, $database);

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

