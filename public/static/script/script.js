
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

socket.on('joke', function(joke){
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = joke
    messageContainer.appendChild(linkElement)
});

var typing = false;
var timeout = undefined;

function timeoutFunction(){
    typing = false;
    socket.emit("typing", typing);
}

const dropUpElement = document.getElementsByClassName("dropdown-menu")[0]

document.getElementById("m").addEventListener("input", function() {
    let string = document.getElementById("m").value
    
    if (/^[/]/.test(string) && string.length === 1) {
        dropUpElement.className = "dropdown-menu dropup show"
    } else {
        dropUpElement.classList.remove("show")
    }

    if(typing == false) {
        typing = true
        socket.emit("typing", typing);
        timeout = setTimeout(timeoutFunction, 3000);
    } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 3000);
    }
})

function clearInputField() {
    dropUpElement.classList.remove("show")
    document.getElementById("m").value = ""
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
    




