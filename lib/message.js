/*
JSON object

params:
  sender - (user) MAX 100 characters
  time
  body - (message) MAX 500 characters

methods: 


*/

module.exports = class Message {
  constructor(sender, body, time){
    this.sender = sender;
    this.body = body;
    this.time = time;
  }
  getSender(id){
    this.sender = users[id]
  }
  
}