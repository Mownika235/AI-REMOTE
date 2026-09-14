
// ==========================================
// AI REMOTE JAVASCRIPT
// ==========================================


// Get HTML elements

const input = document.getElementById("messageInput");

const messages = document.getElementById("messages");

const welcome = document.getElementById("welcome");

const modeMenu = document.getElementById("modeMenu");

const modeText = document.getElementById("modeText");


// Current AI mode

let currentMode = "Friendly";


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const text = input.value.trim();

    // Don't send empty message

    if (text === "") {
        return;
    }


    // Hide welcome screen

    welcome.style.display = "none";


    // Add user's message

    addMessage(
        text,
        "user"
    );


    // Clear input

    input.value = "";


    // Show AI typing

    const typing = addTyping();


    try {

        // Send message to backend

        const response = await fetch(
            "http://127.0.0.1:8000/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: text,

                    mode: currentMode

                })
            }
        );


        const data = await response.json();


        // Remove typing animation

        typing.remove();


        // Show AI response

        addMessage(
            data.reply,
            "ai"
        );


    } catch (error) {

        typing.remove();


        addMessage(
            "⚠️ Backend is not connected. Please start the Python server.",
            "ai"
        );

        console.error(error);

    }

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.classList.add(
        "message",
        sender
    );


    // Avatar

    const avatar = document.createElement("div");

    avatar.classList.add(
        "avatar"
    );


    if (sender === "user") {

        avatar.classList.add(
            "user-avatar"
        );

        avatar.innerText = "👤";

    } else {

        avatar.classList.add(
            "ai-avatar"
        );

        avatar.innerText = "🤖";

    }


    // Content

    const content = document.createElement("div");

    content.classList.add(
        "message-content"
    );


    // Name

    const name = document.createElement("div");

    name.classList.add(
        "message-name"
    );


    name.innerText =
        sender === "user"
            ? "You"
            : "AI Remote";


    // Message bubble

    const bubble = document.createElement("div");

    bubble.classList.add(
        "bubble"
    );

    bubble.innerText = text;


    content.appendChild(name);

    content.appendChild(bubble);


    // Copy button for AI

    if (sender === "ai") {

        const copyButton =
            document.createElement("button");

        copyButton.classList.add(
            "copy-button"
        );

        copyButton.innerText =
            "📋 Copy";

        copyButton.onclick =
            function () {

                navigator.clipboard.writeText(
                    text
                );

                copyButton.innerText =
                    "✅ Copied!";

                setTimeout(
                    function () {

                        copyButton.innerText =
                            "📋 Copy";

                    },
                    1500
                );

            };


        content.appendChild(
            copyButton
        );

    }


    message.appendChild(
        avatar
    );

    message.appendChild(
        content
    );


    messages.appendChild(
        message
    );


    // Scroll to bottom

    const chatArea =
        document.getElementById(
            "chatArea"
        );

    chatArea.scrollTop =
        chatArea.scrollHeight;
}


// ==========================================
// TYPING ANIMATION
// ==========================================

function addTyping() {

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        "ai"
    );


    const avatar =
        document.createElement("div");

    avatar.classList.add(
        "avatar",
        "ai-avatar"
    );

    avatar.innerText = "🤖";


    const content =
        document.createElement("div");

    content.classList.add(
        "message-content"
    );


    const bubble =
        document.createElement("div");

    bubble.classList.add(
        "bubble"
    );

    bubble.innerText =
        "AI Remote is thinking... 💭";


    content.appendChild(
        bubble
    );


    message.appendChild(
        avatar
    );

    message.appendChild(
        content
    );


    messages.appendChild(
        message
    );


    const chatArea =
        document.getElementById(
            "chatArea"
        );

    chatArea.scrollTop =
        chatArea.scrollHeight;


    return message;
}


// ==========================================
// QUICK PROMPTS
// ==========================================

function quickPrompt(text) {

    input.value = text;

    sendMessage();

}


// ==========================================
// ENTER KEY
// ==========================================

function handleEnter(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}


// ==========================================
// NEW CHAT
// ==========================================

function newChat() {

    messages.innerHTML = "";

    welcome.style.display = "block";

    input.value = "";

}


// ==========================================
// DARK MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );

}


// ==========================================
// AI MODE MENU
// ==========================================

function changeMode() {

    modeMenu.classList.toggle(
        "show"
    );

}


function selectMode(mode) {

    currentMode = mode;

    modeText.innerText = mode;

    modeMenu.classList.remove(
        "show"
    );

}


// ==========================================
// VOICE INPUT
// ==========================================

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported. Please use Google Chrome."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.start();


    recognition.onstart =
        function () {

            input.placeholder =
                "🎤 Listening...";

        };


    recognition.onresult =
        function (event) {

            const text =
                event.results[0][0].transcript;

            input.value =
                text;

            input.placeholder =
                "Message AI Remote...";

        };


    recognition.onerror =
        function () {

            input.placeholder =
                "Message AI Remote...";

        };

}


// ==========================================
// ATTACH FILE
// ==========================================

function attachFile() {

    alert(
        "📎 File upload will be added in the next version!"
    );

}


// ==========================================
// DOWNLOAD CHAT
// ==========================================

function downloadChat() {

    const allMessages =
        document.querySelectorAll(
            ".message"
        );


    if (allMessages.length === 0) {

        alert(
            "There is no chat to download."
        );

        return;

    }


    let text =
        "AI REMOTE CHAT\n\n";


    allMessages.forEach(
        function (message) {

            const name =
                message.querySelector(
                    ".message-name"
                ).innerText;

            const content =
                message.querySelector(
                    ".bubble"
                ).innerText;


            text +=
                name +
                ":\n" +
                content +
                "\n\n";

        }
    );


    const blob =
        new Blob(
            [text],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "AI-Remote-Chat.txt";


    link.click();


    URL.revokeObjectURL(
        url
    );

}

