//importit
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');
const Ban = require('./models/Ban');
const app = express();
const server = http.createServer(app);
require("dotenv").config();
const io = socketIo(server);
const dc = require("./log/Discordwebhooks")
app.set('trust proxy', true);
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use((req, res, next) => {
  const userIP = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ip1 = req.headers['x-forwarded-for'] || false;
  const ip2 = req.connection.remoteAddress || false;
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} ${userIP} ${ip1} ${ip2}`);
  dc.sendDCLOG(`[${new Date().toLocaleString()}] ${req.method} ${req.url} ${userIP} ${ip1} ${ip2}`);
  next();
});

//cors
app.use(cors({ origin: ["http://localhost", 'https://www.tyhjyys.fun', 'https://tyhjyys.fun', 'http://www.tyhjyys.fun', 'http://tyhjyys.fun'] }));
app.use(express.json());

//Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
var spam = [];
var useramount = 0;
var chatspeed = 1000;
//websocket

io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;

  try{
    var decode = jwt.verify( token ,process.env.SKEY);
  }
  catch(err){
    io.to(socket.id).emit("chat message", {
      user: 'Server',
      message: `Your token is expired please relog`,
      timestamp: new Date()
    });
    return;
  };
  const user = await User.findById(decode.userId);
  useramount++;
  console.log('User connected:', user.username, "currently users online:", useramount);
  io.emit("user amount", useramount)
  socket.on('disconnect', () => {
    useramount--;
    console.log('User disconnected:', user.username, "currently users online:", useramount);
    io.emit("user amount", useramount)
  });

  //viestien handler
  socket.on('chat message', async (msg) => {
    
    try{
      var decode = jwt.verify( token ,process.env.SKEY);
    }
    catch(err){
      io.to(socket.id).emit("chat message", {
        user: 'Server',
        message: `Your token is expired please relog`,
        timestamp: new Date()
      });
      return;
    };
    const user = await User.findById(decode.userId);
    if(!msg.message){
      return;
    }
    if (spam.includes(user.username)){
      io.to(socket.id).emit('chat message', {
        user: 'Server',
        message: `You are spamming`,
        timestamp: new Date()
      });
      return;
    }
    //kattoo onko bannatty
    if (await isBanned(user.ip)) {
      console.log(`User with ${user.ip} is banned. Message not sent.`);
      io.to(socket.id).emit('chat message', {
        user: 'Server',
        message: `You are banned`,
        timestamp: new Date()
      });
      return;
    }

    if(msg.message.includes("‎")){
      io.to(socket.id).emit('chat message', {
        user: 'Server',
        message: `Dont even try do invisible text`,
        timestamp: new Date()
      });
      return;
    }
    //kattoo onko viesti liian pitkä
    if(msg.message.length > 150 ){
      io.to(socket.id).emit('chat message', {
        user: 'Server',
        message: `Your message is too long`,
        timestamp: new Date()
      });
      return;
    }
    try {
      //kattoo onko useri olemassa
      if (!user) {
        console.log('User not found. Message not sent.');
        io.to(socket.id).emit('chat message', {
          user: 'Server',
          message: `you have no account`,
          timestamp: new Date()
        });
        return;
      }
      //komentojen handler
      if (msg.message.startsWith("/")) {
        const commandParts = msg.message.split(" ");
        const command = commandParts[0];
        const targetUsername = commandParts[1];

        if (command === '/help') {
          let helpMessage = "Available commands: /help";
          if (user.role === "Admin" || user.role === "Owner") {
            helpMessage += ", /ban <username>, /unban <username>";
            if (user.role === "Owner") {
              helpMessage += ", you can also make admins";
            }
          }
          io.to(socket.id).emit('chat message', {
            user: 'Server',
            message: helpMessage,
            timestamp: new Date()
          });

        } else if (command === "/admin") {
          if (user.role == "Owner") {
            if (!targetUsername) {
              io.to(socket.id).emit('chat message', {
                user: 'Server',
                message: `You should know how this command works.`,
                timestamp: new Date()
              });
            }
            makeadmin(targetUsername)
            io.to(socket.id).emit('chat message', {
              user: 'Server',
              message: `${targetUsername} is now admin.`,
              timestamp: new Date()
            });
          }
        }
        else if (user.role === "Admin" || user.role === "Owner") {
          switch (command) {
            case "/chatspeed":
              if(!targetUsername){
                io.to(socket.id).emit('chat message', {
                  user: 'Server',
                  message: 'Usage: /chatspeed <number>',
                  timestamp: new Date()
                });
                return;
              }
              chatspeed = parseInt(targetUsername);
              io.emit('chat message', {
                user: 'Server',
                message: `Chat speed set to ${chatspeed}`,
                timestamp: new Date()
              });
              chatspeed = chatspeed*1000;
              break;
            case '/ban':
              if (!targetUsername) {
                io.to(socket.id).emit('chat message', {
                  user: 'Server',
                  message: 'Usage: /ban <username>',
                  timestamp: new Date()
                });
                return;
              }
              await banUser(targetUsername);
              io.emit('chat message', {
                user: 'Server',
                message: `${targetUsername} has been banned by admin.`,
                timestamp: new Date()
              });
              break;
            case '/shout':
              if (!targetUsername) {
                io.to(socket.id).emit('chat message', {
                  user: 'Server',
                  message: 'Usage: /shout <username>',
                  timestamp: new Date()
                });
                return;
              }
              text = msg.message.replace("/shout ","")
              io.emit('shout', {
                user: user.username,
                message: text
              });
              break;
            case '/mute':
            case '/unban':
              if (!targetUsername) {
                io.to(socket.id).emit('chat message', {
                  user: 'Server',
                  message: 'Usage: /unban <username>',
                  timestamp: new Date()
                });
                return;
              }
              await unbanUser(targetUsername);
              io.emit('chat message', {
                user: 'Server',
                message: `${targetUsername} has been unbanned by admin.`,
                timestamp: new Date()
              });
              break;

            default:
              io.to(socket.id).emit('chat message', {
                user: 'Server',
                message: `Unknown admin command. Type /help for available commands.`,
                timestamp: new Date()
              });
              break;
          }
        }

      } else {
        //Lähettää perus viestin ja tallentaa mongoo
        const newMessage = new Message({
          user: user.username,
          role: user.role,
          message: msg.message,
          timestamp: new Date(),
        });

        await newMessage.save();
        spam.push(user.username);
        io.emit('chat message', newMessage);
        setTimeout(() => {
          let index = spam.indexOf(user.username)
          if (index !== -1){
            spam.splice(index, 1)
          }
        }, chatspeed);
      }

    }
    catch (error) {
      console.error('Error saving message:', error);
    }
  });
  //viesti historian saanti
  socket.on('get messages', async () => {
    try {
      const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
      io.to(socket.id).emit('chat history', messages);
    } catch (error) {
      console.error('Error sending chat history:', error);
    }
  });
});
//adminnien lisäys
async function makeadmin(username) {
  const role = "Admin";
  const user = await User.findOneAndUpdate({ username }, { role });
  if (!user) {
    console.log(`User ${username} not found.`);
    return;
  }
  return;
}

//bannayksen checkkaus
async function isBanned(ip) {
  const ban = await Ban.findOne({ ip });
  return !!ban;
}

//Bannays
async function banUser(username) {
  const user = await User.findOne({ username });
  if (!user) {
    console.log(`User ${username} not found.`);
    return;
  }

  const ban = new Ban({
    user: user.username,
    ip: user.ip,
    reason: 'Banned by admin',
  });

  await ban.save();
}

//unbannays
async function unbanUser(username) {
  await Ban.deleteOne({ user: username });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

