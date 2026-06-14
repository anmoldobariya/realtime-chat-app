const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.querySelector(".container");
const userList = document.getElementById("user-list");

var audio = new Audio("Notification.mp3");

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position === 'right' ? 'right' : 'left');
    messageContainer.append(messageElement);
}

let name = "";
while (name === "" || name === null) {
    name = prompt("Enter your name to join the conversation");
}
socket.emit("new-user-joined", name);

socket.on("user-joined", name => {
    append(`${name} joined the chat`, 'right');
    audio.play();
    addUserToList(name);
});

socket.on("receive", data => {
    append(`${data.name} : ${data.message}`, 'left');
    audio.play();
});

socket.on("left", name => {
    append(`${name} left the chat `, 'right');
    audio.play();
    removeUserFromList(name);
});

socket.on('update-user-list', userList => {
    updateOnlineUsers(userList);
});

function updateOnlineUsers(userList) {
    userList.innerHTML = ''; // Clear the current list

    userList.forEach(userName => {
        addUserToList(userName);
    });

    // userList.sort();
}

function addUserToList(userName) {
    const userItem = document.createElement("li");
    userItem.innerText = userName;
    userList.appendChild(userItem);
}

// Function to remove a user from the user list
function removeUserFromList(userName) {
    const userItems = userList.getElementsByTagName("li");
    for (let i = 0; i < userItems.length; i++) {
        if (userItems[i].innerText === userName) {
            userItems[i].remove();
            break;
        }
    }
}

form.addEventListener('submit', (e) => {
    if (messageInput.value != "") {
        e.preventDefault();
        const message = messageInput.value;
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});