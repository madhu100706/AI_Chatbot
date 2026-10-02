const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat-box");
const clearButton = document.getElementById("clear-button");

function addMessage(message, sender) {

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");

    const messageText = document.createElement("p");
    messageText.textContent = message;

    if (sender === "user") {

        messageDiv.classList.add("user-message");

        avatar.textContent = "👤";

    } else {

        messageDiv.classList.add("bot-message");

        avatar.textContent = "🤖";
    }

    messageContent.appendChild(messageText);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


function addTypingIndicator() {

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "bot-message");
    messageDiv.id = "typing-indicator";

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.textContent = "🤖";

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");

    const typing = document.createElement("div");
    typing.classList.add("typing-dots");

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    messageContent.appendChild(typing);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function useSuggestion(message) {

    userInput.value = message;

    userInput.focus();

}

function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    const welcomeMessage = document.querySelector(".welcome-message");

if (welcomeMessage) {
    welcomeMessage.remove();
}

    addMessage(message, "user");

    userInput.value = "";

    addTypingIndicator();


    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {

    const typingIndicator = document.getElementById("typing-indicator");

    if (typingIndicator) {
        typingIndicator.remove();
    }

    addMessage(data.response, "bot");
})
    .catch(error => {

    console.error("Error:", error);

    const typingIndicator = document.getElementById("typing-indicator");

    if (typingIndicator) {
        typingIndicator.remove();
    }

    addMessage("Sorry, something went wrong.", "bot");
});
}

sendButton.addEventListener("click", sendMessage);


userInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});

clearButton.addEventListener("click", function () {

    fetch("/clear-chat", {
        method: "POST"
    })
    .then(response => response.json())
    .then(() => {

        chatBox.innerHTML = `
            <div class="welcome-message">

                <div class="welcome-icon">
                    ✨
                </div>

                <h2>Welcome! 👋</h2>

                <p>
                    I'm your AI Assistant.
                    Ask me anything and let's get started.
                </p>

                <div class="suggestions">

                    <button onclick="useSuggestion('What is Python?')">
                        🐍 What is Python?
                    </button>

                    <button onclick="useSuggestion('Explain artificial intelligence')">
                        🤖 Explain AI
                    </button>

                    <button onclick="useSuggestion('Help me learn programming')">
                        💻 Learn programming
                    </button>

                </div>

            </div>
        `;

    })
    .catch(error => {
        console.error("Error:", error);
    });

});