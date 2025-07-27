// Ensure all JavaScript runs once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- About Popup functions (for all pages where the popup exists) ---
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

    // Only run if chat elements are present on the current page
    if (chatInput && sendBtn && chatMessages) {
        // Function to add messages to the chat display
        function addMessage(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${type}-message`);
            const pElement = document.createElement('p');
            pElement.textContent = message; // Set text content
            messageDiv.appendChild(pElement);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
        }

        // Variable to store the reminder timeout ID
        let currentReminderTimeout = null;

        // Function to send message to the backend and handle response
        async function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (userMessage === '') {
                return; // Don't send empty messages
            }

            addMessage(userMessage, 'user'); // Display user's message
            chatInput.value = ''; // Clear input field
            sendBtn.disabled = true; // Disable send button
            chatInput.disabled = true; // Disable input field

            try {
                // Send message to your Flask backend
                const response = await fetch('http://localhost:5000/chat', { // IMPORTANT: Ensure this URL matches your Flask backend
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: userMessage })
                });

                const data = await response.json();

                if (response.ok) {
                    addMessage(data.reply, 'bot'); // Display Grandma's reply

                    // Clear any existing reminder and set a new one after bot's response
                    if (currentReminderTimeout) {
                        clearTimeout(currentReminderTimeout);
                    }

                    // Schedule a general well-being reminder after 30 minutes
                    currentReminderTimeout = setTimeout(() => {
                        addMessage("Grandma noticed you're still at it. Remember to stretch those tired muscles, my dear, and have a sip of water!", 'bot');
                        
                        // Schedule a food reminder 10 seconds after the well-being reminder
                        setTimeout(() => {
                            addMessage("And don't forget a little snack, sweetie! A cookie perhaps?", 'bot');
                        }, 10 * 1000); // 10 seconds
                    }, 30 * 60 * 1000); // 30 minutes
                } else {
                    console.error("Backend error:", data.error);
                    addMessage("Oh dear, Grandma can't quite hear you right now. The internet must be acting up!", 'bot');
                }
            } catch (error) {
                console.error("Network or fetch error:", error);
                addMessage("Oh dear, Grandma seems to have lost her spectacles and can't find the internet. Try again in a moment, precious.", 'bot');
            } finally {
                sendBtn.disabled = false; // Re-enable button
                chatInput.disabled = false; // Re-enable input
                chatInput.focus(); // Put cursor back
            }
        }

        // Add event listeners for sending messages
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
        const timer = new StudyPomodoroTimer(); // Initialize timer
    }
    
    // Ambient study room effects (COMMENTED OUT TO AVOID CONFLICTS WITH GIF BACKGROUNDS)
    // const studyRoom = document.querySelector('.room_background.study-room');
    // if (studyRoom) {
    //     const addStudyRoomEffects = () => {
    //         setInterval(() => {
    //             const opacity = 0.05 + Math.random() * 0.05;
    //             studyRoom.style.background = `
    //                 radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(120, 119, 198, ${opacity}) 0%, transparent 50%),
    //                 radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 177, 153, ${opacity}) 0%, transparent 50%),
    //                 radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(120, 119, 198, ${opacity * 0.5}) 0%, transparent 50%)
    //             `;
    //         }, 3000);
    //     };
    //     addStudyRoomEffects();
    // }

    // --- Spotify Popup Logic ---
    const spotifyBtn = document.getElementById('spotifyBtn');
    const spotifyOverlay = document.getElementById('spotifyOverlay');
    const closeSpotifyBtn = document.getElementById('closeSpotifyBtn');
    const playlistInput = document.getElementById('playlist-input');

    // Open Spotify popup
    if (spotifyBtn) {
        spotifyBtn.addEventListener('click', () => {
            if (spotifyOverlay) {
                spotifyOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close Spotify popup
    if (closeSpotifyBtn) {
        closeSpotifyBtn.addEventListener('click', () => {
            if (spotifyOverlay) {
                spotifyOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Close popup when clicking outside
    if (spotifyOverlay) {
        spotifyOverlay.addEventListener('click', (e) => {
            if (e.target === spotifyOverlay) {
                spotifyOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Enter key support for playlist input
    if (playlistInput) {
        playlistInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                embedPlaylist();
            }
        });

        // Auto-focus input when popup opens (optional enhancement)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (spotifyOverlay.classList.contains('active')) {
                        setTimeout(() => {
                            playlistInput.focus();
                        }, 300); // Small delay for animation
                    }
                }
            });
        });
        observer.observe(spotifyOverlay, { attributes: true });
    }

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (spotifyOverlay && spotifyOverlay.classList.contains('active') && e.key === 'Escape') {
            spotifyOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

}); // End of DOMContentLoaded

// --- Spotify Playlist Embed Function ---
// Moved outside DOMContentLoaded so it's globally accessible for onclick events
function embedPlaylist() {
    const input = document.getElementById('playlist-input').value.trim();
    const container = document.getElementById('playlist-container');
    
    if (!input) {
        container.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <p style="color: var(--rust);">Please enter a playlist URL!</p>
                <small>Make sure to paste a valid Spotify playlist link.</small>
            </div>
        `;
        return;
    }

    // Multiple regex patterns to catch different Spotify URL formats
    const patterns = [
        /playlist\/([a-zA-Z0-9_-]+)/,
        /playlist\?si=([a-zA-Z0-9_-]+)/,
        /playlist\/([a-zA-Z0-9_-]+)\?si=/
    ];

    let playlistId = null;
    
    // Try to extract playlist ID from different URL formats
    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match && match[1]) {
            playlistId = match[1];
            break;
        }
    }

    if (playlistId) {
        // Correct Spotify embed URL format
        const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
        
        container.innerHTML = `
            <div class="spotify-player">
                <iframe 
                    src="${embedUrl}" 
                    width="100%" 
                    height="380" 
                    frameborder="0" 
                    allowfullscreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    style="border-radius: 12px;">
                </iframe>
                <div class="player-controls">
                    <button class="refresh-btn" onclick="embedPlaylist()">🔄 Refresh</button>
                    <button class="clear-btn" onclick="clearPlaylist()">✖ Clear</button>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <p style="color: var(--rust);">Invalid Spotify playlist URL!</p>
                <small>Make sure you're using a valid Spotify playlist link.<br>
                Example: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M</small>
            </div>
        `;
    }
}

// Clear playlist function
// Moved outside DOMContentLoaded so it's globally accessible for onclick events
function clearPlaylist() {
    const container = document.getElementById('playlist-container');
    const input = document.getElementById('playlist-input');
    
    if (input) {
        input.value = '';
    }
    
    if (container) {
        container.innerHTML = `
            <div class="default-message">
                <div class="music-icon">🎼</div>
                <p>Paste a Spotify playlist URL above to start listening to your favorite relaxing music!</p>
                <small>Example: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M</small>
            </div>
        `;
    }
}
