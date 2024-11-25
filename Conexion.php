<?php
$host = "192.168.2.5"; // Cambia según tu configuración
$username = "drg"; // Cambia según tu configuración
$password = "Aguero1223"; // Cambia según tu configuración
$database = "prueba"; // Cambia según tu configuración

// Crear conexión
$conexion = new mysqli($host, $username, $password, $database);

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

