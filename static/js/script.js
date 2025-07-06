/**
 * Medical Chatbot JavaScript
 * Handles chat functionality, UI interactions, and API communication
 */

class MedicalChatbot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageForm = document.getElementById('messageForm');
        this.sendButton = document.getElementById('sendButton');
        
        this.initializeEventListeners();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Form submission
        this.messageForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Keyboard shortcuts
        this.messageInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Quick action buttons
        this.initializeQuickActions();
    }

    /**
     * Initialize quick action buttons
     */
    initializeQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const message = action.getAttribute('data-message');
                this.sendQuickMessage(message);
            });
        });
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        e.preventDefault();
        const message = this.messageInput.value.trim();
        if (message) {
            this.sendMessage(message);
            this.clearInput();
        }
    }

    /**
     * Handle keyboard events
     */
    handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.messageForm.dispatchEvent(new Event('submit'));
        }
    }

    /**
     * Auto-resize textarea based on content
     */
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    /**
     * Clear input and reset height
     */
    clearInput() {
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
    }

    /**
     * Send a message
     */
    sendMessage(message) {
        // Remove welcome message if it exists
        this.removeWelcomeMessage();
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Disable send button
        this.toggleSendButton(false);
        
        // Send message to server
        this.sendToServer(message);
    }

    /**
     * Send quick message
     */
    sendQuickMessage(message) {
        this.messageInput.value = message;
        this.messageForm.dispatchEvent(new Event('submit'));
    }

    /**
     * Remove welcome message
     */
    removeWelcomeMessage() {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }

    /**
     * Add message to chat
     */
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const time = this.getCurrentTime();
        const icon = sender === 'user' ? 'user' : 'user-md';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="message-content">
                ${this.formatMessage(content)}
                <span class="message-time">${time}</span>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Format message content (can be extended for markdown, links, etc.)
     */
    formatMessage(content) {
        // Basic HTML escaping
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');
    }

    /**
     * Get current time formatted
     */
    getCurrentTime() {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Toggle send button state
     */
    toggleSendButton(enabled) {
        this.sendButton.disabled = !enabled;
    }

    /**
     * Scroll to bottom of messages
     */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /**
     * Send message to server
     */
    sendToServer(message) {
        // Option 1: Using fetch API (modern approach)
        fetch('/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `msg=${encodeURIComponent(message)}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            this.handleServerResponse(data);
        })
        .catch(error => {
            console.error('Error:', error);
            this.handleServerError(error);
        });

        // Option 2: Using jQuery AJAX (if you prefer jQuery)
        /*
        $.ajax({
            data: { msg: message },
            type: "POST",
            url: "/get",
            success: (data) => {
                this.handleServerResponse(data);
            },
            error: (xhr, status, error) => {
                console.error('AJAX Error:', error);
                this.handleServerError(error);
            }
        });
        */
    }

    /**
     * Handle successful server response
     */
    handleServerResponse(data) {
        this.hideTypingIndicator();
        this.addMessage(data, 'bot');
        this.toggleSendButton(true);
    }

    /**
     * Handle server error
     */
    handleServerError(error) {
        this.hideTypingIndicator();
        this.addMessage(
            'Sorry, I encountered an error while processing your request. Please try again later.',
            'bot'
        );
        this.toggleSendButton(true);
        console.error('Server error:', error);
    }

    /**
     * Simulate bot response (for testing without backend)
     */
    simulateBotResponse(userMessage) {
        const responses = [
            "Thank you for your question. Based on your symptoms, I recommend consulting with a healthcare professional for proper diagnosis.",
            "That's a great health question! Here are some general guidelines that might help...",
            "I understand your concern. While I can provide general information, please remember that this doesn't replace professional medical advice.",
            "Based on current medical knowledge, here's what you should know about this condition...",
            "Your health is important. Let me provide some information that might be helpful...",
            "For symptoms like these, it's always best to monitor them closely and seek medical attention if they persist or worsen.",
            "Thank you for reaching out. Health concerns should always be taken seriously. Here's some general information..."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Use simulation instead of server (for testing)
     */
    sendToServerSimulation(message) {
        // Simulate network delay
        const delay = 1000 + Math.random() * 2000;
        
        setTimeout(() => {
            const response = this.simulateBotResponse(message);
            this.handleServerResponse(response);
        }, delay);
    }
}

// Utility functions
const ChatUtils = {
    /**
     * Escape HTML characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Format timestamp
     */
    formatTime(date = new Date()) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new MedicalChatbot();
    
    // Make chatbot globally accessible for debugging
    window.chatbot = chatbot;
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MedicalChatbot, ChatUtils };
}