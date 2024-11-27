//user schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  ip: { type: String, required: true },
  role: { type: String, enum: ['Admin','Owner','User',"Prob hackerman"], default: 'User' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
