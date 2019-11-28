
const socket = io();

function sendChat(event) {
    event.preventDefault(); // prevents page reloading
    const getMessage = document.getElementById("m");
    socket.emit('chat message', getMessage.value);
    getMessage.value = "";
    return false;
};


socket.on('chat message', function(msg, nickname){
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")
    const pElement = document.createElement("p")

    pElement.innerHTML = nickname
    linkElement.innerHTML = " " + msg
    messageContainer.appendChild(pElement)
    messageContainer.appendChild(linkElement)
});

socket.on('connected user', function(nickname) {
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = nickname + " har anslutit till rummet."
    messageContainer.appendChild(linkElement)
});
socket.on('disconnected user', function(nickname) {
    const messageContainer = document.getElementById("messages");
    const linkElement = document.createElement("li")

    linkElement.innerHTML = nickname + " har lämnat rummet."
    messageContainer.appendChild(linkElement)
});


socket.on('typing', function(typing, nickname){
    const typingContainer = document.getElementById("typing");
    if (typing) {
        typingContainer.innerHTML = nickname + " skriver...";
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

function initSite(){
    displayModal();
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

    




