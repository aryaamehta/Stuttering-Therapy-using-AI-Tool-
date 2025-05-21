document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-toggle');
    const clearBtn = document.getElementById('clear-chat');
    const typingIndicator = document.getElementById('typing-indicator');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    // Check if user is logged in (in a real app, you would check authentication)
    const isLoggedIn = true; // Change based on actual auth status
    
    if (!isLoggedIn) {
        showSystemMessage('Please <a href="login.html">login</a> to access the full chat functionality and save your conversation history.');
        disableChat();
        return;
    }
    
    // Initialize chat
    loadChatHistory();
    
    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    clearBtn.addEventListener('click', clearChat);
    voiceBtn.addEventListener('click', toggleVoiceInput);
    
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            userInput.value = e.target.textContent;
            userInput.focus();
        });
    });
    
    // Functions
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI response after delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response, 'ai');
            
            // Save to chat history
            saveChatMessage(message, response);
            
            // Scroll to bottom
            scrollToBottom();
        }, 1500);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = sender === 'user' ? 'You' : 'StutterCare AI';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = formatMessageText(text);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = getCurrentTime();
        
        contentDiv.appendChild(senderDiv);
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function showSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function formatMessageText(text) {
        // Convert newlines to <br>
        let formattedText = text.replace(/\n/g, '<br>');
        
        // Convert URLs to links
        formattedText = formattedText.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank">$1</a>'
        );
        
        return `<p>${formattedText}</p>`;
    }
    
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function showTypingIndicator() {
        typingIndicator.classList.add('active');
        scrollToBottom();
    }
    
    function hideTypingIndicator() {
        typingIndicator.classList.remove('active');
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function disableChat() {
        userInput.disabled = true;
        sendBtn.disabled = true;
        voiceBtn.disabled = true;
        clearBtn.disabled = true;
        suggestionBtns.forEach(btn => btn.disabled = true);
        userInput.placeholder = 'Please login to chat';
    }
    
    function clearChat() {
        if (confirm('Are you sure you want to clear this conversation?')) {
            chatMessages.innerHTML = '';
            localStorage.removeItem('stuttercare_chat_history');
            
            // Add initial AI message
            addMessage("Hello! I'm your StutterCare AI assistant. How can I help you today?", 'ai');
        }
    }
    
    function toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input is not supported in your browser. Try Chrome or Edge.');
            return;
        }
        
        if (voiceBtn.classList.contains('active')) {
            stopVoiceRecognition();
            voiceBtn.classList.remove('active');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.title = 'Start voice input';
        } else {
            startVoiceRecognition();
            voiceBtn.classList.add('active');
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            voiceBtn.title = 'Stop voice input';
        }
    }
    
    function startVoiceRecognition() {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            userInput.placeholder = 'Listening...';
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            userInput.focus();
        };
        
        recognition.onerror = (event) => {
            console.error('Voice recognition error', event.error);
            userInput.placeholder = 'Type your message here...';
        };
        
        recognition.onend = () => {
            userInput.placeholder = 'Type your message here...';
            if (voiceBtn.classList.contains('active')) {
                recognition.start(); // Continue listening
            }
        };
        
        recognition.start();
    }
    
    function stopVoiceRecognition() {
        // In a real implementation, you would stop the recognition here
        userInput.placeholder = 'Type your message here...';
    }
    
    function generateAIResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Enhanced responses with more variety
        const responses = {
            greeting: [
                "Hello there! How can I assist you with your speech practice today?",
                "Hi! I'm here to help with your speech therapy. What would you like to discuss?",
                "Welcome back! How can I support your speech journey today?"
            ],
            exercises: [
                "Here are some exercises you can try:\n1. Slow reading\n2. Prolonged speech\n3. Breathing exercises\nWhich one would you like to learn more about?",
                "For today, I recommend:\n- Syllable-timed speech\n- Light articulatory contacts\n- Pausing technique\nWould you like details on any of these?",
                "Great question! Try these exercises:\n1. Easy onset practice\n2. Stretching vowels\n3. Choral reading\nWhich would you like to start with?"
            ],
            anxiety: [
                "Speech anxiety is common. Try these techniques:\n- Practice in a comfortable environment\n- Use relaxation techniques\n- Start with small conversations\nWould you like more details on any of these?",
                "For anxiety, I recommend:\n1. Progressive muscle relaxation\n2. Visualization techniques\n3. Positive affirmations\nWould you like me to guide you through one?",
                "Anxiety can be managed with:\n- Slow breathing exercises\n- Gradual exposure to speaking situations\n- Mindfulness meditation\nWhich technique interests you?"
            ],
            conversation: [
                "Let's practice a conversation! I'll start:\n\nHi there! How has your day been so far?",
                "Great! Let's have a casual chat. Tell me, what's your favorite hobby?",
                "Conversation practice time! Here's a topic: Describe your favorite vacation. Take your time..."
            ],
            progress: [
                "Based on your recent sessions:\n- Fluency improved by 15%\n- Average WPM: 120\n- Stutter frequency decreased by 20%\nWould you like exercises to target specific areas?",
                "Your progress report shows:\n- 78% fluency score\n- Completed 3/5 weekly sessions\n- 22% stutter reduction\nKeep up the good work!",
                "Progress highlights:\n✔ Increased speaking confidence\n✔ Better pacing control\n✔ Reduced avoidance behaviors\nWhat would you like to focus on next?"
            ],
            default: [
                "I'm here to help with your speech therapy. You can ask me about exercises, techniques, or general advice. What would you like to know?",
                "I specialize in stuttering therapy. Feel free to ask about exercises, progress tracking, or speech techniques.",
                "How can I assist you with your speech practice today? You can ask about exercises, anxiety management, or just practice conversation."
            ]
        };
        
        // Determine response category
        let category = 'default';
        
        if (/hello|hi|hey/.test(lowerMsg)) {
            category = 'greeting';
        } else if (/exercise|practice|drill/.test(lowerMsg)) {
            category = 'exercises';
        } else if (/anxiety|nervous|stress/.test(lowerMsg)) {
            category = 'anxiety';
        } else if (/talk|speak|conversation|chat/.test(lowerMsg)) {
            category = 'conversation';
        } else if (/progress|report|improvement/.test(lowerMsg)) {
            category = 'progress';
        }
        
        // Select random response from category
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
    
    function saveChatMessage(userMsg, aiMsg) {
        let chatHistory = JSON.parse(localStorage.getItem('stuttercare_chat_history')) || [];
        chatHistory.push({
            user: userMsg,
            ai: aiMsg,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('stuttercare_chat_history', JSON.stringify(chatHistory));
    }
    
    function loadChatHistory() {
        const chatHistory = JSON.parse(localStorage.getItem('stuttercare_chat_history'));
        
        if (chatHistory && chatHistory.length > 0) {
            chatHistory.forEach(entry => {
                addMessage(entry.user, 'user');
                addMessage(entry.ai, 'ai');
            });
            scrollToBottom();
        } else {
            // Initial message if no history
            addMessage("Hello! I'm your StutterCare AI assistant. How can I help you today?", 'ai');
        }
    }
});