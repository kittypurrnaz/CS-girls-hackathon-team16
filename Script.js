// About Popup functions (for all pages where the popup exists)
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById("popup");
    const aboutBtn = document.getElementById("aboutBtn");
    const closeAboutPopupBtn = document.getElementById("closeAboutPopup");

    function openPopup() {
        if (popup) {
            popup.classList.add("open-popup");
        }
    }

    function closePopup() {
        if (popup) {
            popup.classList.remove("open-popup");
        }
    }

    if (aboutBtn) {
        aboutBtn.addEventListener('click', openPopup);
    }
    if (closeAboutPopupBtn) {
        closeAboutPopupBtn.addEventListener('click', closePopup);
    }

    // --- Chatbot Frontend Logic (for room2.html) ---
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');

    if (chatInput && sendBtn && chatMessages) { // Only run if chat elements are present
        function addMessage(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${type}-message`);
            messageDiv.innerHTML = `<p>${message}</p>`;
            chatMessages.appendChild(messageDiv);
            // Scroll to the bottom of the chat messages
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (userMessage === '') {
                return; // Don't send empty messages
            }

            addMessage(userMessage, 'user'); // Add user's message to display
            chatInput.value = ''; // Clear the input field

            // --- Placeholder for AI Integration ---
            // This is where you would typically send `userMessage` to your backend server.
            // The backend would then call the AI model (like Google's Gemini API)
            // and send back the grandma's response.

            // For now, let's simulate a grandma-like response and reminders.
            setTimeout(() => {
                let botResponse = "Oh, my dear, that's a lovely thought. Tell Grandma more about it.";
                
                if (userMessage.toLowerCase().includes("study") || userMessage.toLowerCase().includes("studying")) {
                    botResponse = "Studying, are we, sweetie? That's wonderful! Just make sure to stretch your legs every now and then, and don't forget to blink! Grandma worries about your eyes!";
                    scheduleReminder("water"); // Schedule a reminder after a study-related message
                } else if (userMessage.toLowerCase().includes("stress") || userMessage.toLowerCase().includes("vent") || userMessage.toLowerCase().includes("frustrated")) {
                    botResponse = "Oh, my precious, it sounds like you're feeling a bit overwhelmed. It's perfectly alright to feel that way. Just take a deep breath. Grandma's here, and we can talk about anything.";
                } else if (userMessage.toLowerCase().includes("hungry") || userMessage.toLowerCase().includes("eat")) {
                    botResponse = "Hungry, are we? Grandma knows just the thing! Make sure you get yourself a little snack. A full tummy makes for a happy mind!";
                } else if (userMessage.toLowerCase().includes("tired") || userMessage.toLowerCase().includes("sleep")) {
                    botResponse = "Oh, sweetie, if you're tired, it's time for a proper rest. Even a short nap can do wonders. You can't pour from an empty cup, remember?";
                } else if (userMessage.toLowerCase().includes("water") || userMessage.toLowerCase().includes("drink")) {
                    botResponse = "Goodness, yes! Stay hydrated, my love. A good glass of water keeps you sharp as a tack!";
                } else if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
                    botResponse = "Hello there, darling! So good to hear from you. What brings you to Grandma's living room today?";
                } else {
                    // Default comforting response
                    botResponse = "That's very interesting, dear. What else is on your mind? Grandma's always here to listen.";
                }

                addMessage(botResponse, 'bot');

                // Schedule reminders if not already set (this is basic, you'd refine it)
                if (window.reminderTimeout) clearTimeout(window.reminderTimeout); // Clear previous
                window.reminderTimeout = setTimeout(() => {
                    const reminder = Math.random() < 0.5 ? "Remember to take a little break, my love. Don't overdo it!" : "Have you had a sip of water, dear? Stay hydrated!";
                    addMessage(reminder, 'bot');
                    // Consider scheduling food reminder too
                    setTimeout(() => {
                        addMessage("And don't forget a little snack, sweetie! A cookie perhaps?", 'bot');
                    }, 10 * 1000); // 10 seconds after water reminder
                }, 30 * 60 * 1000); // 30 minutes (30 * 60 * 1000 milliseconds)
            }, 800); // Simulate bot typing delay

            // Function for specific reminders (can be called by bot's logic)
            function scheduleReminder(type) {
                // This is a simplified example. You'd likely want more sophisticated tracking
                // to avoid spamming reminders.
                console.log(`Scheduling a ${type} reminder for Grandma's bot.`);
            }
        }

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // --- Pomodoro Timer Class (Existing from room1.html) ---
    // This code will only initialize if 'openTimerBtn' exists,
    // ensuring it doesn't run on other pages like index.html or room2.html.
    if (document.getElementById('openTimerBtn')) {
        class StudyPomodoroTimer {
            constructor() {
                this.focusDuration = 25; // Default 25 minutes
                this.breakDuration = 5;  // Default short break
                this.currentTime = this.focusDuration * 60; // in seconds
                this.totalTime = this.focusDuration * 60;
                this.isRunning = false;
                this.interval = null;
                this.isBreakTime = false;
                this.sessionCount = 1;
                this.completedSessions = 0;
                
                this.initElements();
                this.bindEvents();
                this.updateDisplay();
                this.updateSessionDisplay();
            }

            initElements() {
                this.openBtn = document.getElementById('openTimerBtn');
                this.overlay = document.getElementById('timerOverlay');
                this.closeBtn = document.getElementById('closeBtn');
                this.timeDisplay = document.getElementById('timeDisplay');
                this.modeStatus = document.getElementById('modeStatus');
                this.startBtn = document.getElementById('startBtn');
                this.resetBtn = document.getElementById('resetBtn');
                this.progressBar = document.getElementById('progressBar');
                this.sessionCountEl = document.getElementById('sessionCount');
                this.completedCountEl = document.getElementById('completedCount');
                this.durationButtons = document.querySelectorAll('.duration-btn');
                this.breakButtons = document.querySelectorAll('.break-btn');
                this.notification = document.getElementById('notification');
                this.notificationText = document.getElementById('notificationText');
                this.notificationClose = document.getElementById('notificationClose');
            }

            bindEvents() {
                if (this.openBtn) { this.openBtn.addEventListener('click', () => this.openTimer()); }
                if (this.closeBtn) { this.closeBtn.addEventListener('click', () => this.closeTimer()); }
                if (this.overlay) {
                    this.overlay.addEventListener('click', (e) => {
                        if (e.target === this.overlay) this.closeTimer();
                    });
                }
                if (this.startBtn) { this.startBtn.addEventListener('click', () => this.toggleTimer()); }
                if (this.resetBtn) { this.resetBtn.addEventListener('click', () => this.resetTimer()); }
                this.durationButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (!this.isRunning) { this.selectDuration(parseInt(e.target.dataset.duration)); }
                    });
                });
                this.breakButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => { this.selectBreakDuration(parseInt(e.target.dataset.break)); });
                });
                if (this.notificationClose) { this.notificationClose.addEventListener('click', () => this.hideNotification()); }
                document.addEventListener('keydown', (e) => {
                    if (this.overlay && this.overlay.classList.contains('active')) {
                        if (e.code === 'Space') { e.preventDefault(); this.toggleTimer(); }
                        if (e.code === 'Escape') { this.closeTimer(); }
                    }
                });
            }

            openTimer() { if (this.overlay) { this.overlay.classList.add('active'); document.body.style.overflow = 'hidden'; } }
            closeTimer() { if (this.overlay) { this.overlay.classList.remove('active'); document.body.style.overflow = 'auto'; } }
            selectDuration(minutes) { this.focusDuration = minutes; if (!this.isBreakTime) { this.currentTime = minutes * 60; this.totalTime = minutes * 60; this.updateDisplay(); this.updateProgressBar(); } this.durationButtons.forEach(btn => { btn.classList.toggle('active', parseInt(btn.dataset.duration) === minutes); }); }
            selectBreakDuration(minutes) { this.breakDuration = minutes; this.breakButtons.forEach(btn => { btn.classList.toggle('active', parseInt(btn.dataset.break) === minutes); }); }
            toggleTimer() { if (this.isRunning) { this.pauseTimer(); } else { this.startTimer(); } }
            startTimer() { this.isRunning = true; if (this.startBtn) { this.startBtn.textContent = '⏸ Pause'; this.startBtn.classList.add('paused'); } this.interval = setInterval(() => { this.currentTime--; this.updateDisplay(); this.updateProgressBar(); if (this.currentTime <= 0) { this.completeSession(); } }, 1000); }
            pauseTimer() { this.isRunning = false; if (this.startBtn) { this.startBtn.textContent = '▶ Start'; this.startBtn.classList.remove('paused'); } clearInterval(this.interval); }
            resetTimer() { this.pauseTimer(); if (this.isBreakTime) { this.currentTime = this.breakDuration * 60; this.totalTime = this.breakDuration * 60; } else { this.currentTime = this.focusDuration * 60; this.totalTime = this.focusDuration * 60; } this.updateDisplay(); this.updateProgressBar(); if (this.timeDisplay) { this.timeDisplay.classList.remove('pulse'); } }
            completeSession() { this.pauseTimer(); if (this.timeDisplay) { this.timeDisplay.classList.add('pulse'); } if (!this.isBreakTime) { this.completedSessions++; this.showNotification('🎉 Focus session complete! Time for a break!', 'success'); this.switchToBreak(); } else { this.showNotification('⚡ Break over! Ready to focus again!', 'info'); this.switchToFocus(); } this.updateSessionDisplay(); this.playNotificationSound(); }
            switchToBreak() { this.isBreakTime = true; this.currentTime = this.breakDuration * 60; this.totalTime = this.breakDuration * 60; if (this.modeStatus) { this.modeStatus.textContent = this.breakDuration === 5 ? 'Short Break' : 'Long Break'; } this.updateDisplay(); this.updateProgressBar(); setTimeout(() => { if (this.timeDisplay) { this.timeDisplay.classList.remove('pulse'); } }, 3000); }
            switchToFocus() { this.isBreakTime = false; this.sessionCount++; this.currentTime = this.focusDuration * 60; this.totalTime = this.focusDuration * 60; if (this.modeStatus) { this.modeStatus.textContent = 'Focus Time'; } this.updateDisplay(); this.updateProgressBar(); setTimeout(() => { if (this.timeDisplay) { this.timeDisplay.classList.remove('pulse'); } }, 3000); }
            updateDisplay() { const minutes = Math.floor(this.currentTime / 60); const seconds = this.currentTime % 60; if (this.timeDisplay) { this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; } }
            updateProgressBar() { const progress = ((this.totalTime - this.currentTime) / this.totalTime) * 100; if (this.progressBar) { this.progressBar.style.width = `${progress}%`; } }
            updateSessionDisplay() { if (this.sessionCountEl) { this.sessionCountEl.textContent = this.sessionCount; } if (this.completedCountEl) { this.completedCountEl.textContent = this.completedSessions; } }
            showNotification(message, type = 'success') { if (this.notification && this.notificationText) { this.notificationText.textContent = message; this.notification.classList.add('show'); setTimeout(() => { this.hideNotification(); }, 5000); } }
            hideNotification() { if (this.notification) { this.notification.classList.remove('show'); } }
            playNotificationSound() { try { const audioContext = new (window.AudioContext || window.webkitAudioContext)(); const oscillator = audioContext.createOscillator(); const gainNode = audioContext.createGain(); oscillator.connect(gainNode); gainNode.connect(audioContext.destination); oscillator.frequency.value = 800; oscillator.type = 'sine'; gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5); oscillator.start(audioContext.currentTime); oscillator.stop(audioContext.currentTime + 0.5); } catch (error) { console.log('Audio notification not available or Web Audio API not supported:', error); } }
            autoStartBreak() { if (this.isBreakTime) { setTimeout(() => { this.startTimer(); }, 2000); } }
        }
        const timer = new StudyPomodoroTimer(); // Initialize timer here as well
    }
    
    // --- COMMENTED OUT: This was overriding the GIF background ---
    // const studyRoom = document.querySelector('.room_background.study-room');
    // if (studyRoom) {
    //     const addStudyRoomEffects = () => {
    //         setInterval(() => {
    //             const opacity = 0.05 + Math.random() * 0.05; // Keep opacity subtle
    //             studyRoom.style.background = `
    //                 radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(120, 119, 198, ${opacity}) 0%, transparent 50%),
    //                 radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 177, 153, ${opacity}) 0%, transparent 50%),
    //                 radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(120, 119, 198, ${opacity * 0.5}) 0%, transparent 50%)
    //             `;
    //         }, 3000); // Change every 3 seconds
    //     };
    //     addStudyRoomEffects();
    // }
});

// Service Worker for notifications (if needed) - This requires a sw.js file
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration failed');
    });
}

// Request notification permission (should ideally be triggered by a user gesture)
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log("Notification permission granted.");
        } else {
            console.log("Notification permission denied.");
        }
    });
}