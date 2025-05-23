document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageForm = document.getElementById('messageForm');
    const userInput = document.getElementById('userInput');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = message;

        messageContent.appendChild(messageParagraph);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typingIndicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to send message to server and get response
    async function sendMessage(message) {
        try {
            showTypingIndicator();
            
            // Use relative URL which works both locally and on Vercel
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();
            
            // Validate that we have a valid message in the response
            if (!data || !data.message) {
                throw new Error('Invalid response from server');
            }
            
            // Simulate a small delay for more natural conversation
            setTimeout(() => {
                removeTypingIndicator();
                addMessage(data.message, false);
            }, 500);
            
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            
            // Different error messages based on the type of error
            if (error.message.includes('Network response was not ok')) {
                addMessage('Server connection issue! Maine bola tha network check karo! 😅', false);
            } else if (error.message.includes('Invalid response')) {
                addMessage('Server confused ho gaya! Maine bola tha server ko coffee pilao! ☕', false);
            } else {
                addMessage('Arre yaar, something went wrong! Maine bola tha server maintenance karna chahiye! 😅', false);
            }
        }
    }

    // Event listener for form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input field
        userInput.value = '';
        
        // Get response from server
        sendMessage(message);
    });

    // Event listeners for suggestion buttons
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = button.getAttribute('data-text');
            userInput.value = message;
            
            // Trigger form submission
            const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true,
            });
            messageForm.dispatchEvent(submitEvent);
        });
    });

    // Focus input field when page loads
    userInput.focus();
});
