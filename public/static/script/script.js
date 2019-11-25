
const socket = io();

function sendChat(event) {
    event.preventDefault(); // prevents page reloading
    const getMessage = document.getElementById("m").value;
    socket.emit('chat message', getMessage);
};


    socket.on('chat message', function(msg){
        console.log(msg)
        const messageContainer = document.getElementById("messages");
        const linkElement = document.createElement("li")

        linkElement.innerHTML = msg
        messageContainer.appendChild(linkElement)
    });
    
    socket.on('connected user', function() {
        const messageContainer = document.getElementById("messages");
        const linkElement = document.createElement("li")

        linkElement.innerHTML = "Anononym user has connected."
        messageContainer.appendChild(linkElement)
    });
    socket.on('disconnected user', function() {
        const messageContainer = document.getElementById("messages");
        const linkElement = document.createElement("li")

        linkElement.innerHTML = "Anononym user has disconnected."
        messageContainer.appendChild(linkElement)
    });



