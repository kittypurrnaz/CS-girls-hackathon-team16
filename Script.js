
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
    }

    initElements() {
        // Pop-up elements
        this.openBtn = document.getElementById('openTimerBtn');
        this.overlay = document.getElementById('timerOverlay');
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
        this.openBtn.addEventListener('click', () => this.openTimer());
        this.closeBtn.addEventListener('click', () => this.closeTimer());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.closeTimer();
        });

        // Timer controls
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

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
        this.notificationClose.addEventListener('click', () => this.hideNotification());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.overlay.classList.contains('active')) {
                e.preventDefault();
                this.toggleTimer();
            }
            if (e.code === 'Escape') {
                this.closeTimer();
            }
        });
    }

    openTimer() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeTimer() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
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
        this.startBtn.textContent = '⏸ Pause';
        this.startBtn.classList.add('paused');

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
        this.startBtn.textContent = '▶ Start';
        this.startBtn.classList.remove('paused');
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
        this.timeDisplay.classList.remove('pulse');
    }

    completeSession() {
        this.pauseTimer();
        this.timeDisplay.classList.add('pulse');

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
        this.modeStatus.textContent = this.breakDuration === 5 ? 'Short Break' : 'Long Break';
        this.updateDisplay();
        this.updateProgressBar();
        
        setTimeout(() => {
            this.timeDisplay.classList.remove('pulse');
        }, 3000);
    }

    switchToFocus() {
        this.isBreakTime = false;
        this.sessionCount++;
        this.currentTime = this.focusDuration * 60;
        this.totalTime = this.focusDuration * 60;
        this.modeStatus.textContent = 'Focus Time';
        this.updateDisplay();
        this.updateProgressBar();
        
        setTimeout(() => {
            this.timeDisplay.classList.remove('pulse');
        }, 3000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgressBar() {
        const progress = ((this.totalTime - this.currentTime) / this.totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    updateSessionDisplay() {
        this.sessionCountEl.textContent = this.sessionCount;
        this.completedCountEl.textContent = this.completedSessions;
    }

    showNotification(message, type = 'success') {
        this.notificationText.textContent = message;
        this.notification.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        this.notification.classList.remove('show');
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
            console.log('Audio notification not available');
        }
    }

    // Auto-start break timer (optional feature)
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
    const timer = new StudyPomodoroTimer();
    
    // Optional: Add some ambient study room effects
    const addStudyRoomEffects = () => {
        // Subtle background animation
        const studyRoom = document.querySelector('.study-room');
        setInterval(() => {
            const opacity = 0.1 + Math.random() * 0.1;
            studyRoom.style.background = `
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, ${opacity}) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 177, 153, ${opacity}) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 119, 198, ${opacity * 0.5}) 0%, transparent 50%)
            `;
        }, 3000);
    };

    addStudyRoomEffects();
});

// Service Worker for notifications (if needed)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration failed');
    });
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
                          }
