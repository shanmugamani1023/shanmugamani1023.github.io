/* ==========================================
   ATHENA — AI Voice & Chat Assistant
   Cloudflare Worker Proxy Version
   ========================================== */

class Athena {
    constructor() {
        this.orb = document.getElementById('athena-orb');
        this.panel = document.getElementById('athena-panel');
        this.messages = document.getElementById('athena-messages');
        this.input = document.getElementById('athena-input');
        this.sendBtn = document.getElementById('athena-send');
        this.micBtn = document.getElementById('athena-mic');
        this.closeBtn = document.getElementById('athena-close');
        this.chips = document.querySelectorAll('.athena-chip');
        this.typingIndicator = document.getElementById('athena-typing');
        this.waveIndicator = document.getElementById('athena-wave');
        this.notifDot = document.getElementById('athena-notif');

        // Cloudflare Worker proxy URL
        // TODO: Replace with your actual Cloudflare Worker URL after deployment
        this.proxyUrl = 'https://athena-proxy.shandev1023.workers.dev';

        this.isOpen = false;
        this.isListening = false;
        this.isProcessing = false;
        this.hasGreeted = false;
        this.conversation = [];
        this.maxHistory = 10;
        this.pendingSpeech = null;
        this.lastCallTime = 0;
        this.minCallInterval = 2000;
        this.maxRetries = 3;

        this.recognition = null;
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.voiceLoaded = false;

        this.bindEvents();
        this.initSpeech();
        this.scheduleGreeting();
    }

    /* ========== Speech Recognition ========== */

    initSpeech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (e) => {
                const text = e.results[0][0].transcript;
                this.addMessage(text, 'user');
                this.input.value = text;
                this.processUserQuery(text);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.micBtn.classList.remove('listening');
                this.waveIndicator.classList.remove('active');
            };

            this.recognition.onerror = () => {
                this.isListening = false;
                this.micBtn.classList.remove('listening');
                this.waveIndicator.classList.remove('active');
            };
        }
    }

    toggleListening() {
        if (!this.recognition) {
            this.addBotMessage('Voice input is only available in Google Chrome. You can type your question instead!');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            return;
        }

        this.recognition.start();
        this.isListening = true;
        this.micBtn.classList.add('listening');
        this.waveIndicator.classList.add('active');
    }

    /* ========== Voice Output ========== */

    speak(text) {
        if (!this.synth) return;

        this.synth.cancel();

        const voices = this.synth.getVoices();
        if (voices.length > 0) {
            this.voice = voices.find(v =>
                (v.name.includes('Google UK English Female') ||
                 v.name.includes('Microsoft Zira') ||
                 v.name.includes('Samantha') ||
                 v.name.includes('Female') ||
                 v.name.includes('female')) &&
                v.lang.startsWith('en')
            ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
            this.voiceLoaded = true;
        }

        if (!this.voiceLoaded) {
            this.pendingSpeech = text;
            this.synth.onvoiceschanged = () => {
                const loadedVoices = this.synth.getVoices();
                if (loadedVoices.length > 0) {
                    this.voice = loadedVoices.find(v =>
                        (v.name.includes('Google UK English Female') ||
                         v.name.includes('Microsoft Zira') ||
                         v.name.includes('Samantha') ||
                         v.name.includes('Female')) &&
                        v.lang.startsWith('en')
                    ) || loadedVoices.find(v => v.lang.startsWith('en')) || loadedVoices[0];
                    this.voiceLoaded = true;
                    if (this.pendingSpeech) {
                        const queued = this.pendingSpeech;
                        this.pendingSpeech = null;
                        this.doSpeak(queued);
                    }
                }
            };
            return;
        }

        this.doSpeak(text);
    }

    doSpeak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice || null;
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 0.9;
        this.synth.speak(utterance);
    }

    stopSpeaking() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.pendingSpeech = null;
    }

    /* ========== UI & Messages ========== */

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.isOpen = true;
        this.panel.classList.add('open');
        this.orb.classList.add('active');
        this.notifDot.style.display = 'none';
    }

    closePanel() {
        this.isOpen = false;
        this.panel.classList.remove('open');
        this.orb.classList.remove('active');
        if (this.isListening && this.recognition) {
            this.recognition.stop();
        }
        this.stopSpeaking();
    }

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `athena-msg ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'athena-msg-avatar';
        avatar.textContent = sender === 'athena' ? 'A' : 'Y';
        msgDiv.appendChild(avatar);

        const content = document.createElement('div');
        content.className = 'athena-msg-content';
        content.textContent = text;
        msgDiv.appendChild(content);

        this.messages.appendChild(msgDiv);
        this.scrollToBottom();
        return msgDiv;
    }

    addBotMessage(text) {
        this.hideTyping();
        this.addMessage(text, 'athena');
        this.speak(text);
    }

    showTyping() {
        this.typingIndicator.classList.add('visible');
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.classList.remove('visible');
        const dots = this.typingIndicator.querySelector('.athena-typing-dots');
        if (dots) dots.style.display = '';
        const retryEl = this.typingIndicator.querySelector('.athena-retry-msg');
        if (retryEl) retryEl.remove();
    }

    showRetrying(current, total) {
        const dotSpans = this.typingIndicator.querySelector('.athena-typing-dots');
        if (dotSpans) {
            dotSpans.style.display = 'none';
        }
        let retryEl = this.typingIndicator.querySelector('.athena-retry-msg');
        if (!retryEl) {
            retryEl = document.createElement('div');
            retryEl.className = 'athena-retry-msg';
            this.typingIndicator.appendChild(retryEl);
        }
        retryEl.textContent = `⏳ One moment... (${current}/${total})`;
        this.typingIndicator.classList.add('visible');
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 50);
    }

    /* ========== Quick Replies ========== */

    handleChipClick(query) {
        if (!this.isOpen) this.openPanel();
        this.addMessage(query, 'user');
        this.processUserQuery(query);
    }

    /* ========== Chat Input ========== */

    handleSend() {
        const text = this.input.value.trim();
        if (!text || this.isProcessing) return;

        this.input.value = '';
        this.addMessage(text, 'user');
        this.processUserQuery(text);
    }

    handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }
    }

    /* ========== Proxy API Call ========== */

    async processUserQuery(query, retryCount = 0) {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;
        if (timeSinceLastCall < this.minCallInterval) {
            const waitTime = this.minCallInterval - timeSinceLastCall;
            await new Promise(r => setTimeout(r, waitTime));
        }

        this.isProcessing = true;
        this.sendBtn.disabled = true;
        this.showTyping();

        try {
            this.lastCallTime = Date.now();
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    conversation: this.conversation.slice(-12),
                }),
            });

            // Rate limited — retry
            if (response.status === 429 && retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount + 1) * 2000;
                this.showRetrying(retryCount + 1, this.maxRetries);
                await new Promise(r => setTimeout(r, delay));
                return this.processUserQuery(query, retryCount + 1);
            }

            if (!response.ok) {
                throw new Error(`Proxy error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.reply || 'Sorry, I couldn\'t process that. Could you ask again?';

            this.conversation.push({ role: 'user', text: query });
            this.conversation.push({ role: 'athena', text: reply });
            if (this.conversation.length > this.maxHistory) {
                this.conversation = this.conversation.slice(-this.maxHistory);
            }

            this.addBotMessage(this.cleanResponse(reply));

        } catch (err) {
            console.error('Athena proxy error:', err.message);

            if (err.message.includes('429') || err.message.includes('Rate limit')) {
                this.addBotMessage('I\'m getting a lot of requests right now. Come back later or try again tomorrow!');
            } else {
                this.addBotMessage('I\'m having trouble connecting right now. Please try again in a moment.');
            }
        }

        this.isProcessing = false;
        this.sendBtn.disabled = false;
    }

    cleanResponse(text) {
        return text.replace(/\*([^*]+)\*/g, '$1').trim();
    }

    /* ========== Auto Greeting ========== */

    scheduleGreeting() {
        setTimeout(() => {
            if (!this.hasGreeted) {
                this.hasGreeted = true;
                this.orb.classList.add('athena-welcome-anim');
                setTimeout(() => this.orb.classList.remove('athena-welcome-anim'), 600);
                this.openPanel();
                this.processUserQuery('hi');
            }
        }, 3500);
    }

    handleOrbClick() {
        this.togglePanel();
        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            this.notifDot.style.display = 'none';
            this.processUserQuery('hi');
        }
    }

    /* ========== Event Binding ========== */

    bindEvents() {
        this.orb.addEventListener('click', () => this.handleOrbClick());
        this.closeBtn.addEventListener('click', () => this.closePanel());
        this.sendBtn.addEventListener('click', () => this.handleSend());
        this.input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
        this.micBtn.addEventListener('click', () => this.toggleListening());

        this.chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                const query = chip.dataset.query;
                this.handleChipClick(query);
            });
        });
    }
}

/* ==========================================
   INITIALIZE
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('athena-orb')) {
        window.athena = new Athena();
    }
});
