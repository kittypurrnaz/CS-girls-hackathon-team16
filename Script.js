// About Popup functions (copied from index.html for room.html's about button)
let popup = document.getElementById("popup");

function openPopup() {
    if (popup) { // Check if popup element exists
        popup.classList.add("open-popup");
    }
}

function closePopup() {
    if (popup) { // Check if popup element exists
        popup.classList.remove("open-popup");
    }
}

// Pomodoro Timer Class
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
        this.updateSessionDisplay(); // Initialize session display
    }

    initElements() {
        // Pop-up elements
        this.openBtn = document.getElementById('openTimerBtn');
        this.overlay = document.getElementById('timerOverlay'); // Corrected ID
        this.closeBtn = document.getElementById('closeBtn');
        
        // Timer elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.modeStatus = document.getElementById('modeStatus');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressBar = document.getElementById('progressBar');
        
        // Counters
        this.sessionCountEl = document.getElementById('sessionCount');
        this.completedCountEl = document.getElementById('completedCount');
        
        // Selection buttons
        this.durationButtons = document.querySelectorAll('.duration-btn');
        this.breakButtons = document.querySelectorAll('.break-btn');
        
        // Notification
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notificationText');
        this.notificationClose = document.getElementById('notificationClose');
    }

    bindEvents() {
        // Pop-up controls
        if (this.openBtn) { // Check if element exists before adding listener
            this.openBtn.addEventListener('click', () => this.openTimer());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeTimer());
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.closeTimer();
            });
        }

        // Timer controls
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.toggleTimer());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetTimer());
        }

        // Duration selection
        this.durationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isRunning) {
                    this.selectDuration(parseInt(e.target.dataset.duration));
                }
            });
        });

        // Break selection
        this.breakButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectBreakDuration(parseInt(e.target.dataset.break));
            });
        });

        // Notification close
        if (this.notificationClose) {
            this.notificationClose.addEventListener('click', () => this.hideNotification());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only trigger if the timer overlay is active
            if (this.overlay && this.overlay.classList.contains('active')) {
                if (e.code === 'Space') {
                    e.preventDefault(); // Prevent scrolling
                    this.toggleTimer();
                }
                if (e.code === 'Escape') {
                    this.closeTimer();
                }
            }
        });
    }

    openTimer() {
        if (this.overlay) {
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scroll when popup is open
        }
    }

    closeTimer() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore body scroll
        }
    }

    selectDuration(minutes) {
        this.focusDuration = minutes;
        if (!this.isBreakTime) {
            this.currentTime = minutes * 60;
            this.totalTime = minutes * 60;
            this.updateDisplay();
            this.updateProgressBar();
        }

        // Update active button
        this.durationButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.duration) === minutes);
        });
    }

    selectBreakDuration(minutes) {
        this.breakDuration = minutes;

        // Update active button
        this.breakButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.break) === minutes);
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        if (this.startBtn) {
            this.startBtn.textContent = '⏸ Pause';
            this.startBtn.classList.add('paused');
        }

        this.interval = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            this.updateProgressBar();

            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        if (this.startBtn) {
            this.startBtn.textContent = '▶ Start';
            this.startBtn.classList.remove('paused');
        }
        clearInterval(this.interval);
    }

    resetTimer() {
        this.pauseTimer();
        
        if (this.isBreakTime) {
            this.currentTime = this.breakDuration * 60;
            this.totalTime = this.breakDuration * 60;
        } else {
            this.currentTime = this.focusDuration * 60;
            this.totalTime = this.focusDuration * 60;
        }
        
        this.updateDisplay();
        this.updateProgressBar();
        if (this.timeDisplay) {
            this.timeDisplay.classList.remove('pulse');
        }
    }

    completeSession() {
        this.pauseTimer();
        if (this.timeDisplay) {
            this.timeDisplay.classList.add('pulse');
        }

        if (!this.isBreakTime) {
            // Completed a focus session
            this.completedSessions++;
            this.showNotification('🎉 Focus session complete! Time for a break!', 'success');
            this.switchToBreak();
        } else {
            // Completed a break session
            this.showNotification('⚡ Break over! Ready to focus again!', 'info');
            this.switchToFocus();
        }

        this.updateSessionDisplay();
        this.playNotificationSound();
    }

    switchToBreak() {
        this.isBreakTime = true;
        this.currentTime = this.breakDuration * 60;
        this.totalTime = this.breakDuration * 60;
        if (this.modeStatus) {
            this.modeStatus.textContent = this.breakDuration === 5 ? 'Short Break' : 'Long Break';
        }
        this.updateDisplay();
        this.updateProgressBar();
        
        setTimeout(() => {
            if (this.timeDisplay) {
                this.timeDisplay.classList.remove('pulse');
            }
        }, 3000);
    }

    switchToFocus() {
        this.isBreakTime = false;
        this.sessionCount++;
        this.currentTime = this.focusDuration * 60;
        this.totalTime = this.focusDuration * 60;
        if (this.modeStatus) {
            this.modeStatus.textContent = 'Focus Time';
        }
        this.updateDisplay();
        this.updateProgressBar();
        
        setTimeout(() => {
            if (this.timeDisplay) {
                this.timeDisplay.classList.remove('pulse');
            }
        }, 3000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        if (this.timeDisplay) {
            this.timeDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    updateProgressBar() {
        const progress = ((this.totalTime - this.currentTime) / this.totalTime) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }

    updateSessionDisplay() {
        if (this.sessionCountEl) {
            this.sessionCountEl.textContent = this.sessionCount;
        }
        if (this.completedCountEl) {
            this.completedCountEl.textContent = this.completedSessions;
        }
    }

    showNotification(message, type = 'success') {
        if (this.notification && this.notificationText) {
            this.notificationText.textContent = message;
            this.notification.classList.add('show');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.hideNotification();
            }, 5000);
        }
    }

    hideNotification() {
        if (this.notification) {
            this.notification.classList.remove('show');
        }
    }

    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available or Web Audio API not supported:', error);
        }
    }

    // Auto-start break timer (optional feature) - currently not called
    autoStartBreak() {
        if (this.isBreakTime) {
            setTimeout(() => {
                this.startTimer();
            }, 2000);
        }
    }
}

// Initialize the timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize the timer if the necessary elements are present (i.e., on room.html)
    if (document.getElementById('openTimerBtn')) {
        const timer = new StudyPomodoroTimer();
    }
    
    // Optional: Add some ambient study room effects (only on room.html)
    const studyRoom = document.querySelector('.room_background.study-room');
    if (studyRoom) {
        const addStudyRoomEffects = () => {
            setInterval(() => {
                const opacity = 0.05 + Math.random() * 0.05; // Keep opacity subtle
                studyRoom.style.background = `
                    radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(120, 119, 198, ${opacity}) 0%, transparent 50%),
                    radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 177, 153, ${opacity}) 0%, transparent 50%),
                    radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(120, 119, 198, ${opacity * 0.5}) 0%, transparent 50%)
                `;
            }, 3000); // Change every 3 seconds
        };
        addStudyRoomEffects();
    }
});

// Service Worker for notifications (if needed) - This requires a sw.js file
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration failed');
    });
}

// Request notification permission
// This should ideally be triggered by a user gesture, not on page load
// For now, it's here, but in production, consider a button click.
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log("Notification permission granted.");
        } else {
            console.log("Notification permission denied.");
        }
    });
}