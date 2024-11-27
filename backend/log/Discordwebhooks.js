//webhook schema
const axios = require("axios");
require('dotenv').config();
async function sendDCLOG(message) {
  try {
    const webhookUrl = process.env.WEBHOOKDC || NaN;
    const payload = {
      content: message
    };

    await axios.post(webhookUrl, payload);
  } catch (error) {
    console.error('Error sending message to Discord:', error.message);
  }
}
module.exports = {sendDCLOG}