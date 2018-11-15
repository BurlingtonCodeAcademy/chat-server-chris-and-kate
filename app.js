const fs = require('fs');
const $path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const publicDir = $path.resolve('./public');

app.use(express.static('public'));
app.listen(port, () => console.log(`Chat app listening on port ${port}!`));

app.get("/messages", (request, response) =>{
  response.sendFile($path.join(publicDir, "main.html"));

});
