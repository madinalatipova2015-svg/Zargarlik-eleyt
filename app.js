document.addEventListener("DOMContentLoaded", () => {
    
    let state = {
        xp: 0,
        level: 1,
        cart: [],
        totalPrice: 0,
        userName: "Madina (Siz)",
        aiStage: "get_name",
        currentLesson: "html_1",
        completedLessons: {
            robot: [],
            academy: []
        },
        leaderboard: [
            { name: "Shohruhbek (Ustoz)", xp: 320 },
            { name: "Aliyor", xp: 180 },
            { name: "Madina (Siz)", xp: 0 },
            { name: "Laylo", xp: 90 },
            { name: "Samandar", xp: 40 }
        ]
    };

    const quizData = {
        html_1: {
            title: "📝 1-Dars: HTML Sarlavhalar",
            video: "https://www.youtube.com/embed/tgbNymZ7vqY",
            question: "Savol: HTML-da eng katta sarlavha qaysi teg yordamida yoziladi?",
            correctAnswer: "h1",
            options: [
                { text: "A) &lt;h6&gt;", val: "h6" },
                { text: "B) &lt;h1&gt;", val: "h1" },
                { text: "C) &lt;p&gt;", val: "p" }
            ]
        },
        css_1: {
            title: "📝 2-Dars: CSS Rang berish",
            video: "https://www.youtube.com/embed/OEV8gMkCHXQ",
            question: "Savol: Matn rangini qizil (red) qilish uchun qaysi CSS xossasi to'g'ri berilgan?",
            correctAnswer: "color",
            options: [
                { text: "A) text: red;", val: "text" },
                { text: "B) color: red;", val: "color" },
                { text: "C) font-style: red;", val: "font" }
            ]
        },
        js_1: {
            title: "📝 3-Dars: JavaScript O'zgaruvchilar",
            video: "https://www.youtube.com/embed/W6NZfCO5SIk",
            question: "Savol: Zamonaviy JavaScriptda o'zgaruvchi yaratish uchun qaysi kalit so'zdan foydalanamiz?",
            correctAnswer: "let",
            options: [
                { text: "A) var_new", val: "var_new" },
                { text: "B) let yoki const", val: "let" },
                { text: "C) createVariable", val: "create" }
            ]
        },
        js_2: {
            title: "📝 4-Dars: JavaScript Funktsiyalar",
            video: "https://www.youtube.com/embed/OEV8gMkCHXQ",
            question: "Savol: JS da funktsiya qanday kalit so'z bilan e'lon qilinadi?",
            correctAnswer: "function",
            options: [
                { text: "A) function myFunction()", val: "function" },
                { text: "B) method myFunction()", val: "method" },
                { text: "C) def myFunction()", val: "def" }
            ]
        },
        ard_1: {
            title: "📝 5-Dars: Ultrasonik Masofa Sensori",
            video: "https://www.youtube.com/embed/tgbNymZ7vqY",
            question: "Savol: HC-SR04 ultrasonik sensorining masofani o'lchash prinsipi nimaga asoslangan?",
            correctAnswer: "tovush",
            options: [
                { text: "A) Yorug'lik nurlariga", val: "yoruglik" },
                { text: "B) Ultratovush to'lqinlarining qaytish vaqtiga", val: "tovush" },
                { text: "C) Magnit maydoniga", val: "magnit" }
            ]
        }
    };

    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const themeToggle = document.getElementById("themeToggle");
    const userXPElem = document.getElementById("userXP");
    const cartCountElem = document.getElementById("cartCount");
    const toast = document.getElementById("toast");
    const profileName = document.getElementById("profileName");
    const userLevelElem = document.getElementById("userLevel");
    const codeEditor = document.getElementById("codeEditor");
    const previewWindow = document.getElementById("previewWindow");
    const runCodeBtn = document.getElementById("runCodeBtn");

    function showToast(message, type = "success") {
        if (!toast) return;
        toast.innerText = message;
        toast.style.background = type === "error" ? "#ef4444" : (type === "info" ? "#3b82f6" : "#1e293b");
        toast.classList.add("show");
        setTimeout(() => { toast.classList.remove("show"); }, 3000);
    }

    // SAHIFALAR ALMASHINUVI
    const tabs = document.querySelectorAll(".nav-tab");
    const pages = document.querySelectorAll(".tab-page");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const target = tab.getAttribute("data-target");
            tabs.forEach(t => t.classList.remove("active"));
            pages.forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            document.getElementById(`${target}Page`).classList.add("active");
        });
    });

    function updateLeaderboardUI() {
        const leaderboardList = document.getElementById("leaderboardList");
        if (!leaderboardList) return;
        state.leaderboard.forEach(u => {
            if (u.name.includes("(Siz)")) { 
                u.name = `${state.userName.replace(" (Siz)", "")} (Siz)`; 
                u.xp = state.xp; 
            }
        });
        state.leaderboard.sort((a, b) => b.xp - a.xp);
        leaderboardList.innerHTML = "";
        state.leaderboard.forEach((user, index) => {
            const li = document.createElement("li");
            li.className = "leaderboard-item";
            if (user.name.includes("(Siz)")) li.classList.add("current-user");
            let m = index === 0 ? "🥇 " : (index === 1 ? "🥈 " : (index === 2 ? "🥉 " : `${index + 1}. `));
            li.innerHTML = `<span>${m} ${user.name}</span> <b>${user.xp} XP</b>`;
            leaderboardList.appendChild(li);
        });
    }

    function addXP(amount) {
        state.xp += amount;
        if (userXPElem) userXPElem.innerText = state.xp;
        let newLevel = Math.floor(state.xp / 150) + 1;
        if (newLevel > state.level) {
            state.level = newLevel;
            showToast(`🎉 TABRIKLAYMIZ! ${state.level}-bosqichga chiqdingiz!`);
            if (userLevelElem) userLevelElem.innerText = `${state.level}-Bosqich`;
        }
        updateLeaderboardUI();
    }

    window.loadLesson = function(lessonId) {
        state.currentLesson = lessonId;
        const currentData = quizData[lessonId];
        if (!currentData) return;

        document.getElementById("lessonTitle").innerText = currentData.title;
        document.getElementById("lessonVideo").src = currentData.video;
        document.getElementById("quizQuestion").innerText = currentData.question;

        const optionsContainer = document.querySelector(".quiz-options");
        optionsContainer.innerHTML = "";
        
        const isCompleted = state.completedLessons.academy.includes(`quiz_${lessonId}`);

        currentData.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "btn-option";
            btn.innerHTML = opt.text;
            
            if (isCompleted) {
                btn.disabled = true;
                if (opt.val === currentData.correctAnswer) btn.classList.add("correct");
            } else {
                btn.onclick = () => checkQuizAnswer(opt.val, btn);
            }
            optionsContainer.appendChild(btn);
        });

        document.querySelectorAll(".lesson-nav-item").forEach(item => item.classList.remove("active"));
        if (event && event.target) {
            const closestItem = event.target.closest(".lesson-nav-item");
            if (closestItem) closestItem.classList.add("active");
        }
    };

    window.checkQuizAnswer = function(answer, clickedBtn) {
        const currentData = quizData[state.currentLesson];
        const quizKey = `quiz_${state.currentLesson}`;
        const allButtons = document.querySelectorAll(".quiz-options .btn-option");

        if (answer === currentData.correctAnswer) {
            clickedBtn.classList.add("correct");
            allButtons.forEach(b => b.disabled = true);
            if (!state.completedLessons.academy.includes(quizKey)) {
                state.completedLessons.academy.push(quizKey);
                addXP(40);
                showToast("🎯 To'g'ri javob! +40 XP berildi.", "success");
            }
        } else {
            clickedBtn.classList.add("wrong");
            showToast("❌ Noto'g'ri javob. Qayta urinib ko'ring!", "error");
            setTimeout(() => {
                clickedBtn.classList.remove("wrong");
            }, 1200);
        }
    };

    if (runCodeBtn && codeEditor && previewWindow) {
        runCodeBtn.addEventListener("click", () => {
            previewWindow.innerHTML = codeEditor.value.trim();
            showToast("Kod bajarildi!", "info");
        });
    }

    if (themeToggle) themeToggle.addEventListener("click", () => { document.body.classList.toggle("dark-theme"); });

    loadLesson("html_1");
    updateLeaderboardUI();
});