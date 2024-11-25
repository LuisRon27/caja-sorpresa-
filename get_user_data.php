<?php

require './Conexion.php';

// Asegurarse de que el ID del usuario esté presente
$userId = 1; // ID del usuario logueado

// Asegurarse de que el ID sea un número entero
$userId = (int) $userId;

if ($userId <= 0) {
    echo json_encode(['error' => 'ID de usuario no válido']);
    exit();
}

// Verificar la conexión a la base de datos
if (!$conexion) {
    echo json_encode(['error' => 'Error en la conexión a la base de datos']);
    exit();
}

// Ejecutar la consulta con una sentencia preparada
$stmt = $conexion->prepare("SELECT tickets FROM users WHERE id = ?");
if ($stmt === false) {
    echo json_encode(['error' => 'Error en la preparación de la consulta']);
    exit();
}

// Vinculamos el ID del usuario a la consulta
$stmt->bind_param("i", $userId);

// Ejecutamos la consulta
$stmt->execute();

// Obtenemos el resultado
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Si el usuario existe, obtenemos los tickets
    $user = $result->fetch_assoc();
    echo json_encode(['tickets' => $user['tickets']]);
} else {
    // Si no se encuentra el usuario
    echo json_encode(['error' => 'Usuario no encontrado']);
}

// Cerrar la conexión
$stmt->close();
$conexion->close();
?>
