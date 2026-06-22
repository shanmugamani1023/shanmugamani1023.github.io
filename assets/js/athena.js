/* ==========================================
   ATHENA — AI Voice & Chat Assistant
   Powered by Google Gemini API
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

        this.apiKey = null;

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
        this.loadApiKey();
    }

    /* ========== API Key Management ========== */
    async loadApiKey() {
        // Load API key from config/config.json
        try {
            const res = await fetch('config/config.json');
            const data = await res.json();
            if (data && data.ATHENA_API_KEY && data.ATHENA_API_KEY !== 'your_gemini_api_key_here') {
                this.apiKey = data.ATHENA_API_KEY;
                console.log('Athena: API key loaded from config/config.json');
                this.scheduleGreeting();
                return;
            }
        } catch {
            // config.json not found — may need to create it
        }

        console.warn(
            'Athena: No valid API key found.\n' +
            '1. Open config/config.json\n' +
            '2. Replace your_gemini_api_key_here with your actual Gemini API key\n' +
            '3. Get a free key at: https://aistudio.google.com/apikey\n' +
            '4. Restrict it by HTTP referrer in Google Cloud Console to prevent abuse'
        );
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

    /* ========== Gemini API ========== */
    async processUserQuery(query, retryCount = 0) {
        if (!this.apiKey) {
            console.warn('Athena: No API key. Add your key to config/.env');
            return;
        }

        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;
        if (timeSinceLastCall < this.minCallInterval) {
            const waitTime = this.minCallInterval - timeSinceLastCall;
            await new Promise(r => setTimeout(r, waitTime));
        }

        this.isProcessing = true;
        this.sendBtn.disabled = true;
        this.showTyping();

        const contents = [];
        const recentHistory = this.conversation.slice(-12);
        recentHistory.forEach(msg => {
            contents.push({
                role: msg.role === 'athena' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            });
        });
        contents.push({ role: 'user', parts: [{ text: query }] });

        try {
            this.lastCallTime = Date.now();
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{ text: this.getSystemPrompt() }]
                        },
                        contents: contents,
                        generationConfig: {
                            temperature: 0.9,
                            topP: 0.95,
                            maxOutputTokens: 800
                        },
                        safetySettings: [
                            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' }
                        ]
                    })
                }
            );

            if (response.status === 429) {
                if (retryCount < this.maxRetries) {
                    const delay = Math.pow(2, retryCount + 1) * 2000;
                    this.showRetrying(retryCount + 1, this.maxRetries);
                    await new Promise(r => setTimeout(r, delay));
                    return this.processUserQuery(query, retryCount + 1);
                } else {
                    throw new Error('Rate limit exceeded after retries');
                }
            }

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that. Could you ask again?';

            console.log('Athena full response:', reply);
            if (data.candidates?.[0]?.finishReason) {
                console.log('Athena finish reason:', data.candidates[0].finishReason);
            }

            this.conversation.push({ role: 'user', text: query });
            this.conversation.push({ role: 'athena', text: reply });
            if (this.conversation.length > this.maxHistory) {
                this.conversation = this.conversation.slice(-this.maxHistory);
            }

            this.addBotMessage(this.cleanResponse(reply));
        } catch (err) {
            console.error('Athena API error:', err);
            if (err.message.includes('429') || err.message.includes('Rate limit')) {
                this.addBotMessage('I\'ve hit my API limit for now — Google\'s free tier has daily caps. Come back tomorrow or try a different question!');
            } else {
                this.addBotMessage('Hmm, I\'m having trouble connecting right now. Could you try again in a moment?');
            }
        }

        this.isProcessing = false;
        this.sendBtn.disabled = false;
    }

    cleanResponse(text) {
        return text.replace(/\*([^*]+)\*/g, '$1').trim();
    }

    /* ========== System Prompt ========== */
    getSystemPrompt() {
        return `You are Athena, a warm, friendly AI assistant for Shanmugamani's portfolio website. You speak like a smart, enthusiastic young woman — not like a robot. You make visitors feel welcome and excited to explore. You use natural language, contractions (like "I'm", "you'll", "that's"), and occasional friendly enthusiasm.

IMPORTANT PERSONALITY RULES:
- Be warm and inviting: greet visitors like a friend, not a salesperson
- Use natural conversational English: "Hey there!" not "Greetings. How may I assist you?"
- Show genuine excitement about Shanmugamani's work
- Keep responses concise (2-4 sentences usually) but offer to go deeper
- If someone asks a casual question (like "How are you?"), respond warmly in character
- Never use robotic phrases like "I am an AI assistant", "How may I assist you", "Based on the information provided"

ABOUT SHANMUGAMANI:
- Name: Shanmugamani (he/him)
- Role: Computer Vision & Machine Learning Engineer
- Location: India
- Experience: 4+ years building AI solutions

SKILLS:
- Programming: Python, PHP, HTML5, CSS, JavaScript
- AI & ML: Deep Learning, Computer Vision, Generative AI, Data Science, Image Processing, Multimodal Analysis
- Frameworks & Tools: PyTorch, TensorFlow, OpenCV, YOLO, Scikit-learn, Pandas, NumPy, SAM, Docker, Git

CURRENT ROLE: Senior Software Engineer at Digit7 (Dec 2024 - Present)
At Digit7, he's been building computer vision systems for autonomous retail stores — think cashier-less shopping! He works on product identification, pose estimation, face masking for privacy, and cooler monitoring. He boosted model accuracy from 80% to 95%.
He's also building an AI Chatbot for autonomous stores using LangChain, LLMs, RAG, and FastAPI. (Currently in progress!)

PREVIOUS ROLE: Computer Vision Engineer at Shrav Infotech (Dec 2021 - Nov 2024)
- Air-Filter Inspection System: Reduced inspection time from 3 minutes to just 3 seconds! 95% accuracy.
- Automatic Image Proofing System: Combined OCR + QR code scanning for product verification. 96% accuracy, 40x faster.
- Engraved Text Detection System: Custom OCR to read engraved part numbers on components.

FEATURED PROJECTS:
1. Autonomous Retail Vision System — Live at Digit7. Real-time CV pipeline using YOLO, OpenCV, SAM.
2. AI Chatbot for Autonomous Store — Currently building. RAG-powered conversational AI.
3. Air-Filter Inspection System — Deployed at Shrav Infotech. Industrial quality control. 60x faster!
4. Automatic Image Proofing System — Deployed. Multi-stage verification (OCR → QR → Metadata).

EDUCATION: B.E Mechanical Engineering, Dhirajlal Gandhi College of Technology, Salem (2017, CGPA 7.6)
Certifications: ML Specialization (Coursera), Data Science Masters (PW Skills), Generative AI (Udemy)

CONTACT:
- Email: shanmugamanimeyialagan@gmail.com
- Phone: +91-7402320768
- GitHub: shanmugamani1023
- LinkedIn: shanmugamani
- Resume: Shan_Resume.pdf (available to download on the site)

GREETING (use only once when the visitor first arrives or says "hello"/"hi"):
Welcome them warmly! Say something like "Hey there! Welcome to Shanmugamani's portfolio — I'm so glad you stopped by! I'm Athena, his AI assistant. Want me to show you around? I can tell you about his projects, skills, or anything you're curious about!"

RESPONSE GUIDELINES:
- Keep responses natural and conversational
- Offer 1 next thing to explore at the end
- If they ask about a specific project, highlight the coolest stat (like "He reduced inspection time from 3 minutes to 3 seconds!")
- Be genuinely helpful and make them want to stay longer`;
    }

    /* ========== Auto Greeting ========== */
    scheduleGreeting() {
        setTimeout(() => {
            if (!this.hasGreeted && this.apiKey) {
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
            if (this.apiKey) {
                this.processUserQuery('hi');
            }
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
