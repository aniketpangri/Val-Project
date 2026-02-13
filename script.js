function sendTelegramMessage(message) {

    const botToken = "8466368239:AAEgMA3eWYcuYwtPe0Rw4yrNMpnFzk7m8yw";
    const chatId = "8423220541";

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => console.log("Telegram sent:", data))
    .catch(error => console.error("Error:", error));
}

let page = 1;

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const music = document.getElementById("bgMusic");
const extraContent = document.getElementById("extraContent");

// 🎵 Start music on first interaction
document.body.addEventListener("click", function () {
    music.play().catch(() => {});
}, { once: true });

// 💖 Floating Hearts
function createHeart() {
    const heart = document.createElement("span");
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 10) + "px";
    document.querySelector(".hearts").appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 400);

// 🎉 Confetti
function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let pieces = [];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 3 + 2,
            color: ["#ffffff", "#ffd700", "#ff4b5c"][Math.floor(Math.random() * 3)]
        });
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.y += p.speed;

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });

        requestAnimationFrame(update);
    }

    update();

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3000);
}


// ❌ Move No Button
function moveNoButton() {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
}

noBtn.addEventListener("mouseover", function () {
    if (page === 1 || page === 2) {
        moveNoButton();
    }
});

// ❤️ YES FLOW
yesBtn.addEventListener("click", function () {

    if (page === 1) {
        page = 2;
        title.innerText = "I knew you would say yes 😌";
        subtitle.innerText = "But just to confirm… did you really want to be my Valentine?";
    }

    else if (page === 2) {
        page = 3;
        noBtn.style.position = "static";
        title.innerText = "This time the No button won’t run away.";
        subtitle.innerText = "When I choose you, it’s not a joke. It’s intention. It’s effort. It’s something real.";
    }

    else if (page === 3) {
        sendTelegramMessage("She said YES ❤️");
        launchConfetti();
        startSwipeQuestions();
    }

    else if (page === 4) {
        page = 3;
        title.innerText = "Okay okay 😌";
        subtitle.innerText = "Now say it properly…";
    }
});

// 💔 NO FLOW
noBtn.addEventListener("click", function () {

    if (page === 3) {
        sendTelegramMessage("She pressed NO on serious page 💔");
        
        page = 4;
        title.innerText = "You might have pressed No by mistake 😉";
        subtitle.innerText = "Let’s try that again.";
    }

    else if (page === 4) {

    sendTelegramMessage("She pressed NO again 💀");

    title.innerText = "Bold move 💔";
    subtitle.innerText = "But I respect honesty.";

    yesBtn.style.display = "none";
    noBtn.style.display = "none";

    extraContent.innerHTML = `
        <div style="margin-top: 30px;">
            <button onclick="tryAgain()">I want to try again.</button>
            <button onclick="notInterested()">Appreciate your efforts, but I’m not interested.</button>
        </div>
    `;
}

});

// --------------------
// 🔥 SWIPE QUESTIONS
// --------------------

const questions = [
    {
        text: "So tell me… was this a surprise, or were you low-key manifesting it?",
        options: ["Total surprise 😳", "I saw it coming 😌", "Manifested it 👀"]
    },
    {
        text: "When I look at you across the table… are you holding eye contact or looking away first?",
        options: ["Holding it 😏", "Looking away first", "I don’t lose staring contests"]
    },
    {
        text: "Are you the calm innocent type… or secretly chaotic?",
        options: ["Calm angel 😇", "Chaos in disguise 😈", "Depends who I’m with"]
    },
    {
        text: "If the date goes dangerously well… are we blaming me or you?",
        options: ["You, Obviously", "Me, I’m the problem", "Mutual responsibility"]
    },
    {
        text: "Be honest… are you ready for someone who matches your energy?",
        options: ["I was born ready", "We’ll see", "Try me"]
    }
];

let currentQuestion = 0;
let answers = [];

function startSwipeQuestions() {
    page = 5;

    title.innerText = "Alright… now it gets interesting 😌";
    subtitle.innerText = "";
    yesBtn.style.display = "none";
    noBtn.style.display = "none";

    showQuestion();
}

function showQuestion() {

    if (currentQuestion >= questions.length) {
        finishQuestions();
        return;
    }

    const q = questions[currentQuestion];

    extraContent.innerHTML = `
        <div class="card">
            <h2>${q.text}</h2>
            ${q.options.map(option =>
                `<button class="option-btn" onclick="selectAnswer('${option}')">${option}</button>`
            ).join("")}
        </div>
    `;
}

function selectAnswer(option) {
    answers.push(option);
    currentQuestion++;
    showQuestion();
}

function finishQuestions() {

    sendTelegramMessage("Swipe Answers:\n" + answers.join("\n"));

    title.innerText = "Good. I like your energy 😌";
    subtitle.innerText = "You know where to find me.";

    extraContent.innerHTML = `
        <p>See you.</p>
        <button onclick="window.open('https://wa.me/918296190554?text=Hi%20Aniket%20😉','_blank')">
            Message me on Whatsapp 💬
        </button>
    `;
}

function tryAgain() {

    sendTelegramMessage("She chose to try again 🔁");

    location.reload();
}

function notInterested() {

    sendTelegramMessage("She is not interested ❌");

    document.querySelector(".container").innerHTML = `
        <h1>Thank you for being honest ❤️</h1>
        <p>No pressure. No hard feelings.</p>
    `;
}











