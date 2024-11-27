//Ban schema
const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  user: String,
  ip: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
});

const Ban = mongoose.model('Ban', banSchema);

module.exports = Ban;
