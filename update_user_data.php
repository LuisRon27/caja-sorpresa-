<?php

require './Conexion.php';

$userId = 1; // ID del usuario logueado

// Recibir los datos JSON del frontend
$data = json_decode(file_get_contents("php://input"), true);  // 'true' convierte el JSON en un array asociativo

// Verificar que los datos necesarios estén presentes
if (!isset($data['reward']) || !isset($data['tickets_used'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$reward = $data['reward']; // 'reward' puede ser un número o una cadena
$ticketsUsed = intval($data['tickets_used']); // Asegúrate de que tickets_used sea un número entero

// Verificar que el valor de 'reward' sea válido (aceptar tanto valores numéricos como las cadenas 'ticket' o 'coins')
if (!(is_numeric($reward) || in_array($reward, ['ticket', 'coins']))) {
    echo json_encode(['error' => 'Recompensa inválida']);
    exit;
}

// Obtener los tickets y monedas actuales del usuario
$query = "SELECT tickets, coins FROM users WHERE id = ?";
$stmt = $conexion->prepare($query);
if ($stmt === false) {
    echo json_encode(['error' => 'Error al preparar la consulta']);
    exit;
}

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si el usuario existe
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $currentTickets = intval($user['tickets']);
    $currentCoins = intval($user['coins']);

    // Verificar si el usuario tiene suficientes tickets para jugar
    if ($currentTickets < $ticketsUsed) {
        echo json_encode(['error' => 'No tienes suficientes tickets']);
        exit;
    }

    // Restar los tickets usados para jugar
    $newTickets = $currentTickets - $ticketsUsed;

    // Determinar el valor de las monedas a sumar según la recompensa
    $coinsToAdd = 0;
    if (is_numeric($reward)) {
        // Si la recompensa es un número, considerarlo como monedas
        $coinsToAdd = $reward; // Sumar las monedas a las existentes
    } elseif ($reward === 'coins') {
        // Si reward es 'coins', sumar 100 monedas (o cualquier cantidad que definas)
        $coinsToAdd = 100;
    } elseif ($reward === 'ticket') {
        // Si reward es 'ticket', sumar 1 ticket
        $newTickets = $newTickets + 1;
    } else {
        // Si la recompensa es un valor numérico diferente de 'coins' o 'ticket'
        echo json_encode(['error' => 'Recompensa no válida']);
        exit;
    }

    // Sumar las monedas a las actuales
    $newCoins = $currentCoins + $coinsToAdd;

    // Actualizar los tickets y las monedas en la base de datos
    $query = "UPDATE users SET tickets = ?, coins = ? WHERE id = ?";
    $stmt = $conexion->prepare($query);
    if ($stmt === false) {
        echo json_encode(['error' => 'Error al preparar la actualización']);
        exit;
    }

    $stmt->bind_param("iii", $newTickets, $newCoins, $userId);
    $stmt->execute();

    // Confirmar resultado
    echo json_encode(['success' => true, 'new_tickets' => $newTickets, 'reward' => $reward, 'coins_added' => $coinsToAdd, 'new_coins' => $newCoins]);
} else {
    echo json_encode(['error' => 'Usuario no encontrado']);
}

// Cerrar la consulta y la conexión
$stmt->close();
$conexion->close();
?>
