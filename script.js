let ticketCount = 0; // Contador de tickets del usuario
let resultsLog = []; // Almacenar los resultados obtenidos
const rewardOptions = [
    { type: 'coins', amount: 250, weight: 30 },    
    { type: 'coins', amount: 500, weight: 10 },   
    { type: 'coins', amount: 10000, weight: 10 }, 
    { type: 'ticket', amount: 1, weight: 50 }      
];

// Elementos del DOM
const ticketDisplay = document.querySelector('#ticketDisplay');
const cube = document.querySelector("#cube");
const ctop = document.querySelector(".top");
const cleft = document.querySelector(".left");
const cright = document.querySelector(".right");
const cback = document.querySelector(".back");
const glow = document.querySelector(".hexagon");
const powerup = document.querySelector(".powerup");
const transitionTime = "750ms";

// Aplicar transiciones a elementos
const elements = [ctop, cleft, cright, cube, powerup, glow, cback];
elements.forEach(el => el.style.transition = `all ${transitionTime} ease-in-out`);

// Función para actualizar la visualización de tickets
function updateTicketDisplay() {
    ticketDisplay.textContent = `Tickets: ${ticketCount}`;
}

// Función para obtener los tickets del usuario desde PHP
async function fetchUserTickets() {
    try {
        const response = await fetch('get_user_data.php');
        const data = await response.json();

        console.log(data);
        if (data.tickets !== undefined) {
            ticketCount = data.tickets;
            console.log(ticketCount);
            updateTicketDisplay();
        } else {
            console.error(data.error || 'Error desconocido al recuperar los tickets');
        }
    } catch (error) {
        console.error('Error al comunicar con el servidor:', error);
    }
}

// Función para seleccionar una recompensa basada en probabilidades
function getRandomReward(options) {
    const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
    const randomWeight = Math.random() * totalWeight;

    let weightSum = 0;
    for (const option of options) {
        weightSum += option.weight;
        if (randomWeight <= weightSum) {
            return option;
        }
    }
}

// Función para actualizar los datos del usuario en PHP
async function updateUserData(reward) {
    try {
        const dataToSend = {
            reward: reward.type === 'ticket' ? 'ticket' : reward.amount,
            tickets_used: 1
        };
        console.log('Enviando datos al servidor:', dataToSend);

        const response = await axios.post('update_user_data.php', dataToSend);

        if (response.data.success) {
            ticketCount = response.data.new_tickets;
            updateTicketDisplay();
            resultsLog.push(reward);
        } else {
            console.error(response.data.error || 'Error desconocido al actualizar los datos');
        }
    } catch (error) {
        console.error('Error al comunicar con el servidor:', error);
    }
}

// Función para abrir la caja y obtener una recompensa
cube.addEventListener("click", openCube);
function openCube() {
    if (ticketCount <= 0) {
        alert('No tienes suficientes tickets para jugar.');
        return;
    }

    const reward = getRandomReward(rewardOptions);

    // Animaciones de apertura
    const isMobile = window.innerWidth < 768;
    const translateDistance = isMobile ? "2rem" : "3rem";
    const openSize = isMobile ? "60px" : "80px";

    ctop.style.transform = `translateY(-${translateDistance})`;
    cleft.style.transform = `translateX(-${translateDistance})`;
    cright.style.transform = `translateX(${translateDistance})`;
    [ctop, cleft, cright, cback].forEach(el => el.style.opacity = "0.1");
    glow.style.opacity = "0.5";
    powerup.style.opacity = "1";
    cube.style.animationPlayState = "paused";
    powerup.style.zIndex = "10";
    powerup.style.height = openSize;
    powerup.style.width = openSize;

    // Mostrar recompensa
    displayReward(reward);

    // Actualizar datos del usuario
    updateUserData(reward);

    // Reiniciar estado después de 1.5 segundos
    setTimeout(() => closeCube(), 1500);
}

// Función para cerrar la caja
function closeCube() {
    ctop.style.transform = "translateY(0)";
    cleft.style.transform = "translateX(0)";
    cright.style.transform = "translateX(0)";
    [cube, ctop, cleft, cright, cback, glow].forEach(el => el.style.opacity = "1");
    powerup.style.opacity = "0";
    powerup.style.zIndex = "0";
    cube.style.animationPlayState = "running";
    powerup.style.height = "36px";
    powerup.style.width = "36px";
}

// Función para mostrar la recompensa
function displayReward(reward) {
    if (reward.type === 'ticket') {
        powerup.style.backgroundImage = "url('https://www.svgrepo.com/show/296809/ticket.svg')";
        powerup.textContent = "¡Ticket!";
    } else {
        powerup.style.backgroundImage = "url('https://www.svgrepo.com/show/253914/coin.svg')";
        powerup.textContent = `¡+${reward.amount}!`;
    }
    powerup.style.display = "flex";
    powerup.style.alignItems = "center";
    powerup.style.justifyContent = "center";
    powerup.style.color = "#fff";
    powerup.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchUserTickets(); // Obtener tickets del usuario
    updateTicketDisplay(); // Actualizar visualización inicial
});
