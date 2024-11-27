//message schema
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
  role: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
