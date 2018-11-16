const fs = require("fs");
const $path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;
const publicDir = $path.resolve("./public");
const messagesDir = $path.resolve("./chat");
app.use(express.static("public"));
app.listen(port, () => console.log(`Chat app listening on port ${port}!!!`));

const Message = require("./lib/message.js");
const Room = require("./lib/room.js");

app.get("/", (request, response) => {
  response.sendFile($path.join(publicDir, "main.html"));
});

app.post("/chat", express.urlencoded({ extended: false }), (request, response) => {
    console.log(request.body);
    createMessage(nextMessageId(), request.body, response);
  }
);
app.get('/chat', (request, response) => {
  response.sendFile($path.join(publicDir, 'main.html'))
})

app.get('/chat.json', (request, response) => {
  let chat = allMessages();
  let data = JSON.stringify(chat);
  response.type('application/json').send(data);
})

app.get('/room-name', (request, response) => {
  response.sendFile($path.join(publicDir, 'room-name.html'))

})

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



//app.get('/main', (request, response) => {
//let htmlFile = $path.join(publicDir, "main.html");
/// response.sendFile(htmlFile);
//})
//app.post('/main', express.urlencoded({extended: false}
//createMessage(nextMessageId(), request.body, response)
//})
