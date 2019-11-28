
const socket = io();
let typing = false;
let timeout = undefined;
const dropUpElement = document.getElementsByClassName("dropdown-menu")[0]
const messageContainer = document.getElementById("messages");
const sendButton = document.getElementById("sendButton")

buttonStatus();

function sendChat(event) {
    event.preventDefault(); // prevents page reloading
    const getMessage = document.getElementById("m");
    socket.emit('chat message', getMessage.value);
    getMessage.value = "";
    return false;
};

document.getElementById("m").addEventListener("input", function() {

    buttonStatus();
    shortCommmand();
    stillTyping();
})

function timeoutFunction(){
    typing = false;
    socket.emit("typing", typing);
}

function stillTyping() {
    let messageField = document.getElementById("m").value
    let stillTyping = messageField.length;

    if(typing == false) {
        typing = true
        socket.emit("typing", typing);
        if (!stillTyping) {
            timeout = setTimeout(timeoutFunction, 1000);
        }
    } else {
        if (!stillTyping) {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 1000);
        }
    }
}

function shortCommmand() {
    let messageField = document.getElementById("m").value
    
    if (/^[/]/.test(messageField) && messageField.length === 1) {
        dropUpElement.className = "dropdown-menu dropup show"
    } else {
        dropUpElement.classList.remove("show")
    }
}

function clearInputField() {
    dropUpElement.classList.remove("show")
    document.getElementById("m").value = ""
    stillTyping();
}

function scrollBottom() {
    var log = $('.messageContainer');
    log.scrollTop(log.prop("scrollHeight"));
}

function buttonStatus() {
    let messageField = document.getElementById("m").value
  
    if (messageField.length) {
        sendButton.className = "btn btn-primary"
        sendButton.disabled = false;
    } else {
        sendButton.className = "btn btn-primary disabled"
        sendButton.disabled = true;
    }
}

function getGIF() {
    // axios.get('https://api.yomomma.info/')
    // .then(function (response) {
    // console.log(response);
    // })
    // .catch(function (error) {
    // console.log(error);
    // });

    clearInputField();
}

function getJoke() {
    axios.get('/joke')
    .then(function (response) {
        socket.emit('joke', response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
    clearInputField();
}

    

socket.on('chat message', function(msg){
    const linkElement = document.createElement("li")

    linkElement.innerHTML = msg
    messageContainer.appendChild(linkElement)
    stillTyping();
    scrollBottom();
    buttonStatus();
});

socket.on('connected user', function() {
    const linkElement = document.createElement("li")

    linkElement.innerHTML = "Random user has connected."
    messageContainer.appendChild(linkElement)

    scrollBottom();
});
socket.on('disconnected user', function() {
    const linkElement = document.createElement("li")

    linkElement.innerHTML = "Random user has disconnected."
    messageContainer.appendChild(linkElement)

    scrollBottom();
});

socket.on('typing', function(typing){
    const typingContainer = document.getElementById("typing");
    if (typing) {
        typingContainer.innerHTML = "Någon skriver...";
    } else {
        typingContainer.innerHTML = "";
    }
});

socket.on('joke', function(joke){
    const linkElement = document.createElement("li")

    linkElement.innerHTML = joke
    messageContainer.appendChild(linkElement)

    scrollBottom();
});




