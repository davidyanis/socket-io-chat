
const socket = io();
let typing = false;
let timeout = undefined;
const dropUpElement = document.getElementsByClassName("dropdown-menu")[0]
const messageContainer = document.getElementById("messages");
const sendButton = document.getElementById("sendButton")

buttonStatus();

function initSite(){
    displayModal();
}

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
    axios.get('/gif')
    .then(function (response) {
        socket.emit('gif', response.data);
    })
    .catch(function (error) {
        console.log(error);
    });

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

    

var modal = document.getElementById("initialtChatModal");
var modalContent = document.getElementById("modalContent");

function displayModal() {
    modal.style.display = "block";
    modalContent.style.display = "block";
}

function saveNickname(event){
    event.preventDefault();
    let inputNickName = document.getElementById("chatUser").value;
    if(inputNickName.length <= 2){
        alert("Alias måste innehålla minst 3 karaktärer");
        return
    }
    socket.emit('userNickName', inputNickName);
    axios.post('/addNick', {
        name: inputNickName
    })
    .then(function (response) {
    if(response.status == 200){
        alert(response.data);
        modal.style.display = "none";
        modalContent.style.display = "none";
    }
    })
    .catch(function (error) {
    alert(error.response.data.message);
    });
}



socket.on('chat message', function(msg, nickname){
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")
    const pElement = document.createElement("p")

    pElement.innerHTML = nickname
    linkElement.innerHTML = " " + msg
    messageContainer.appendChild(pElement)
    messageContainer.appendChild(linkElement)
    stillTyping();
    scrollBottom();
    buttonStatus();
});

socket.on('connected user', function(nickname) {
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = nickname + " har anslutit till rummet."
    messageContainer.appendChild(linkElement)

    scrollBottom();
});
socket.on('disconnected user', function(nickname) {
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = nickname + " har lämnat rummet."
    messageContainer.appendChild(linkElement)

    scrollBottom();
});


socket.on('typing', function(typing, nickname){
    const typingContainer = document.getElementById("typing");
    if (typing) {
        typingContainer.innerHTML = nickname + " skriver...";
    } else {
        typingContainer.innerHTML = "";
    }
});

socket.on('joke', function(joke){
    const linkElement = document.createElement("li")

    linkElement.innerHTML = joke
    messageContainer.appendChild(linkElement)
})

socket.on('gif', function(gif){
    const imgElement = document.createElement("img");
    imgElement.src = gif;
    imgElement.style.height = "10em"
   
    messageContainer.appendChild(imgElement)

    scrollBottom();
});




