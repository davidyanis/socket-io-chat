
const socket = io();

function sendChat(event) {
    event.preventDefault(); // prevents page reloading
    const getMessage = document.getElementById("m");
    socket.emit('chat message', getMessage.value);
    getMessage.value = "";
    return false;
};


socket.on('chat message', function(msg){
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = msg
    messageContainer.appendChild(linkElement)
});

socket.on('connected user', function() {
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = "Random user has connected."
    messageContainer.appendChild(linkElement)
});
socket.on('disconnected user', function() {
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = "Random user has disconnected."
    messageContainer.appendChild(linkElement)
});

socket.on('typing', function(typing){
    const typingContainer = document.getElementById("typing");
    if (typing) {
        typingContainer.innerHTML = "Någon skriver...";
    } else {
        typingContainer.innerHTML = "";
    }
});

var typing = false;
var timeout = undefined;

function timeoutFunction(){
    typing = false;
    socket.emit("typing", typing);
}

document.getElementById("m").addEventListener("input", function() {
    if(typing == false) {
        typing = true
        socket.emit("typing", typing);
        timeout = setTimeout(timeoutFunction, 3000);
    } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 3000);
    }
})
    




