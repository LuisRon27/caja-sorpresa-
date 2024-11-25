let ticketCount = 0;
let resultsLog = [];
const rewardOptions = [
    { type: 'coins', amount: 250, weight: 30 },    
    { type: 'coins', amount: 500, weight: 10 },   
    { type: 'coins', amount: 10000, weight: 10 }, 
    { type: 'ticket', amount: 1, weight: 50 }      
];

// Lista de preguntas sobre criptomonedas
const cryptoQuestions = [
    {
        question: "¿Qué es Bitcoin?",
        options: ["Una criptomoneda", "Un sistema bancario", "Una aplicación de redes sociales", "Una moneda física"],
        correctAnswer: 0
    },
    {
        question: "¿Cuál de estos es un algoritmo de consenso en blockchain?",
        options: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Todas las anteriores"],
        correctAnswer: 3
    },
    {
        question: "¿Qué es un 'wallet' en criptomonedas?",
        options: ["Un lugar físico para guardar dinero", "Un software para guardar claves privadas", "Una red de mineros", "Un exchange"],
        correctAnswer: 1
    },
    {
        question: "¿Ethereum es una criptomoneda?",
        options: ["Sí", "No", "Solo una plataforma", "Solo un token"],
        correctAnswer: 0
    },
    {
        question: "¿Qué significa la sigla NFT?",
        options: ["Non-Fungible Token", "Normal Financial Transaction", "New Financial Trading", "None Financial Token"],
        correctAnswer: 0
    }
];

// Preguntas de Sí/No
const yesNoQuestions = [
    {
        question: "¿Bitcoin fue la primera criptomoneda en existir?",
        correctAnswer: true
    },
    {
        question: "¿Es posible minar Ethereum con GPUs?",
        correctAnswer: true
    },
    {
        question: "¿El límite máximo de Bitcoin es de 100 millones?",
        correctAnswer: false
    },
    {
        question: "¿Satoshi Nakamoto es el nombre real del creador de Bitcoin?",
        correctAnswer: false
    },
    {
        question: "¿Las transacciones en blockchain son reversibles?",
        correctAnswer: false
    }
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
const questionBox = document.querySelector('#questionBox');
const questionText = document.querySelector('#questionText');
const optionsContainer = document.querySelector('#options');
const responseMessage = document.querySelector('#responseMessage');
const nextQuestionButton = document.querySelector('#nextQuestionButton');

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

        if (data.tickets !== undefined) {
            ticketCount = data.tickets;
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

// Función para abrir la caja con animación
function openCubeAnimation() {
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
    questionBox.style.display = 'none';
}

// Función para mostrar recompensa directa
function displayReward(reward, isQuestion = false) {
    if (isQuestion) {
        powerup.style.backgroundImage = "url('https://images.vexels.com/content/143553/preview/red-3d-question-mark-f15b8d.png')";
        powerup.textContent = "";
    } else if (reward.type === 'ticket') {
        powerup.style.backgroundImage = "url('https://www.svgrepo.com/show/296809/ticket.svg')";
        powerup.textContent = "";
    } else if (reward.type === 'coins') {
        powerup.style.backgroundImage = "url('https://www.svgrepo.com/show/253914/coin.svg')";
        powerup.textContent = `¡+${reward.amount}!`;
    }

    powerup.style.display = "flex";
    powerup.style.alignItems = "center";
    powerup.style.justifyContent = "center";
    powerup.style.color = "#fff";
    powerup.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
}

// Función para mostrar la pregunta
function showQuestion(question, isYesNo = false) {
    questionBox.style.display = 'block';
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    responseMessage.textContent = '';
    responseMessage.className = 'alert';
    responseMessage.style.display = 'none';

    if (isYesNo) {
        const yesButton = document.createElement('button');
        const noButton = document.createElement('button');
        
        yesButton.textContent = 'Sí';
        noButton.textContent = 'No';
        
        [yesButton, noButton].forEach(button => {
            button.classList.add('btn', 'btn-outline-dark', 'w-100', 'mb-2');
        });

        yesButton.onclick = () => checkYesNoAnswer(true, question.correctAnswer);
        noButton.onclick = () => checkYesNoAnswer(false, question.correctAnswer);

        optionsContainer.appendChild(yesButton);
        optionsContainer.appendChild(noButton);
    } else {
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('btn', 'btn-outline-dark', 'w-100', 'mb-2');
            button.onclick = () => checkAnswer(index, question.correctAnswer);
            optionsContainer.appendChild(button);
        });
    }
    nextQuestionButton.style.display = 'none';
}

// Función para verificar respuestas Sí/No
function checkYesNoAnswer(selectedAnswer, correctAnswer) {
    const isCorrect = selectedAnswer === correctAnswer;
    responseMessage.style.display = 'block';
    
    if (isCorrect) {
        responseMessage.textContent = "¡Respuesta correcta! Ganaste 500 monedas.";
        responseMessage.className = 'alert alert-success';
        updateUserData({ type: 'coins', amount: 500 });
    } else {
        responseMessage.textContent = "¡Respuesta incorrecta! Intenta de nuevo.";
        responseMessage.className = 'alert alert-danger';
    }

    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
    nextQuestionButton.style.display = 'inline-block';
}

// Función para comprobar respuestas de opción múltiple
function checkAnswer(selectedOption, correctAnswer) {
    responseMessage.style.display = 'block';
    
    if (selectedOption === correctAnswer) {
        responseMessage.textContent = "¡Respuesta correcta! Ganaste 500 monedas.";
        responseMessage.className = 'alert alert-success';
        updateUserData({ type: 'coins', amount: 500 });
    } else {
        responseMessage.textContent = "¡Respuesta incorrecta! Intenta de nuevo.";
        responseMessage.className = 'alert alert-danger';
    }

    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
    nextQuestionButton.style.display = 'inline-block';
}

// Función principal para abrir la caja
cube.addEventListener("click", openCube);
async function openCube() {
    if (ticketCount <= 0) {
        alert('No tienes suficientes tickets para jugar.');
        return;
    }

    openCubeAnimation();
    const randomValue = Math.random();
    
    if (randomValue < 0.2) { // 20% probabilidad de pregunta múltiple
        displayReward(null, true); // Mostrar signo de interrogación
        setTimeout(() => {
            const question = cryptoQuestions[Math.floor(Math.random() * cryptoQuestions.length)];
            showQuestion(question, false);
        }, 750);
    } else if (randomValue < 0.4) { // 20% probabilidad de pregunta Sí/No
        displayReward(null, true); // Mostrar signo de interrogación
        setTimeout(() => {
            const question = yesNoQuestions[Math.floor(Math.random() * yesNoQuestions.length)];
            showQuestion(question, true);
        }, 750);
    } else { // 60% probabilidad de recompensa directa
        const reward = getRandomReward(rewardOptions);
        displayReward(reward, false);
        await updateUserData(reward);
        setTimeout(() => closeCube(), 1500);
    }
}

// Función para pasar a la siguiente pregunta
function nextQuestion() {
    closeCube();
    questionBox.style.display = 'none';
    nextQuestionButton.style.display = 'none';
    responseMessage.style.display = 'none';
    questionText.textContent = '';
    nextQuestionButton.textContent = 'Siguiente';
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    fetchUserTickets();
    updateTicketDisplay();
    nextQuestionButton.addEventListener('click', nextQuestion);
});