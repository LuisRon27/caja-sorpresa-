CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único para cada usuario
    username VARCHAR(50) NOT NULL UNIQUE, -- Nombre de usuario (único)
    password VARCHAR(255) NOT NULL, -- Contraseña (encriptada)
    tickets INT DEFAULT 0, -- Número de tickets que posee el usuario
    coins INT DEFAULT 0, -- Número de monedas que posee el usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del usuario
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de última actualización
);

INSERT INTO users (username, password, tickets, coins) 
VALUES 
('test_user', 'test_password', 5, 100), 
('demo_user', 'demo_password', 3, 50);

