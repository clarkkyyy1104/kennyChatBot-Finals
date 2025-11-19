const messages = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

let _config = {
    openAI_api: "https://alcuino-chatbot.azurewebsites.net/api/OpenAIProxy",
    openAI_model: "gpt-4o-mini",
    ai_instruction: 'You are Kenny, a friendly and helpful AI assistant. You are kind and gentle. You can help users with questions, provide information, and have engaging conversations.',
    response_id: ""
};

// welcome message
addBotMessage("Hi! I'm Kenny, your AI assistant! 👋 Ask me anything and I'll do my best to help you!");

// API funcyions
async function sendopenAIRequest(text) {
    let requestBody = {
        model: _config.openAI_model,
        input: text,
        instructions: _config.ai_instruction
    };
    
    if (_config.response_id.length > 0) {
        requestBody.previous_response_id = _config.response_id;
    }
    
    try {
        const response = await fetch(_config.openAI_api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_config.openAI_apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        let output = data.output[0].content[0].text;
        _config.response_id = data.id;
        return output;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}

// functions
function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "user-message";
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addBotMessage(html) {
    const div = document.createElement("div");
    div.className = "bot-message";
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addLoadingMessage() {
    const div = document.createElement("div");
    div.className = "bot-message loading-message";
    div.id = "loading-message";
    div.innerHTML = `
        <div class="loading-text">Thinking<span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span></div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeLoadingMessage() {
    const loading = document.getElementById("loading-message");
    if (loading) loading.remove();
}

async function handleSend() {
    const userText = input.value.trim();
    if (!userText) return;
    
    addUserMessage(userText);
    input.value = "";
    sendBtn.disabled = true;
    
    addLoadingMessage();
    
    try {
        const botResponse = await sendopenAIRequest(userText);
        removeLoadingMessage();
        addBotMessage(botResponse);
    } catch (error) {
        removeLoadingMessage();
        addBotMessage("Sorry, there was an error processing your request. Please try again! 😊");
    } finally {
        sendBtn.disabled = false;
        input.focus();
    }
}

// event listeners
sendBtn.addEventListener("click", handleSend);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
});

// focus input on load

input.focus();
