module.exports = class Message {
  constructor(id, user, message, time, room = 'main'){
    this.id = id;
    this.user = user;
    this.message = message;
    this.time = time;
    this.room = room;
  }
  
}