const fs = require("fs");
const $path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;
const publicDir = $path.resolve("./public");
const messagesDir = $path.resolve("./chat");
const roomsDir = $path.resolve("./chat/rooms");

app.use(express.static("public"));
app.listen(port, () => console.log(`Chat app listening on port ${port}!!!`));

const Message = require("./lib/message.js");
const Room = require("./lib/room.js");

app.get("/", (request, response) => {
  response.sendFile($path.join(publicDir, "main.html"));
});

// NEW MESSAGES
app.post("/chat", express.urlencoded({ extended: false }), (request, response) => {
    console.log(request.body);
    createMessage(nextMessageId(), request.body, response);
  }
);
app.get('/chat', (request, response) => {
  response.sendFile($path.join(publicDir, 'main.html'))
})

app.get('/chat.json', (request, response) => {
  let messages = allMessages();
  let data = JSON.stringify(messages);
  response.type('application/json').send(data);
})

// NEW ROOMS
app.post("/chat/rooms", express.urlencoded({ extended: false }), (request, response) => {
  console.log(request.body);
  createRoom(request.body.topic, response);
});

app.get('/chat/rooms', (request, response) => {
  let rooms = allRooms();

  let roomName = request.body.topic;
  response.sendFile($path.join(publicDir, `${roomName}.json`))
})

app.get('/chat/rooms.json', (request, response) => {
  let rooms = allRooms();
  let data = JSON.stringify(rooms);
  response.type('application/json').send(data);
})

function createRoom(topic, response){
  let newRoom = new Room(topic);

  let roomDataFile = $path.join(roomsDir, topic + ".json");
  fs.writeFile(roomDataFile, JSON.stringify(newRoom), err => {
    if (err) {
      response.status(500).send(err);
    } else {
      response.redirect("/chat");
    }
  });
}
function allRooms() {
  return fs
    .readdirSync(roomsDir)
    .filter(file => file.endsWith(".json"))
    .map(file => JSON.parse(fs.readFileSync($path.join(roomsDir, file))))
    //.sort((a, b) => a.id - b.id);
}

// note: need to write function if NO messages currently.
function createMessage(messageId, params, response) {
  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  let message = new Message(
    messageId,
    params.user.trim(),
    params.message.trim(),
    time,
  );
  let messageDataFile = $path.join(messagesDir, messageId + ".json");
  fs.writeFile(messageDataFile, JSON.stringify(message), err => {
    if (err) {
      response.status(500).send(err);
    } else {
      response.redirect("/chat");
    }
  });
}
function allMessages() {
  return fs
    .readdirSync(messagesDir)
    .filter(file => file.endsWith(".json"))
    .map(file => JSON.parse(fs.readFileSync($path.join(messagesDir, file))))
    .sort((a, b) => a.id - b.id);
}

function nextMessageId() {
  let chat = allMessages();

  // find the highest id...
  let id = chat[chat.length - 1].id;

  // ...and pick a higher one
  let messageId = id + 1;
  return messageId;
}




