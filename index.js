const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/user')
const jobRoute=require("./routes/job")
const bookMarkRoute=require("./routes/bookmark")
const chatRoute=require("./routes/chat")
const messageRoute=require("./routes/messages")
dotenv.config()
//process.env.VARIABLE_NAME

mongoose.connect(process.env.MONGO_URL,)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  app.use(express.json())
app.use("/api/",authRoute)
app.use("/api/users",userRoute)
app.use("/api/jobs", jobRoute)
app.use("/api/bookmarks", bookMarkRoute)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)

const server=app.listen(process.env.PORT|| 5002,()=>{console.log(`Example app listening on port ${process.env.PORT||5002}!`)})
const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
      //localhost
        //origin:"http://localhost:5001",

      //hostedServer
        origin:"https://jobhub-backend-production-e18f.up.railway.app/"
    }});

    io.on("connection",(socket)=>{
    console.log("Connected to socket.io");
    socket.on("setup",(userId)=>{
        socket.join(userId);
        socket.broadcast.emit("online-user", userId);
        console.log("User joined socket room:", userId);
    });
    socket.on('typing',(room)=>{
      console.log("typing..");
      console.log("room");
      socket.to(room).emit('typing', room)
    });

    socket.on('stop typing',(room)=>{
      console.log("Stop typing");
      console.log("room");
      socket.to(room).emit('stop typing', room)
    });

    socket.on('join chat',(room)=>{
      socket.join(room)
      console.log('User Joined:'+ room);
    });

    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        var room=chat._id;
        var sender=newMessageReceived.sender;

        if(!sender|| sender._id){
          console.log("Sender not defined");
          return;
        }
        
        var senderId=sender._id;
        console.log(senderId+"message sender");
        const users=chat.users;
        if(!users) {
          console.log("User not defined");
        return;
        }

        socket.to(room).emit("message received", newMessageReceived);
        socket.to(room).emit("message sent", "New message");
      });
      socket.off('setup',()=>{
        console.log("User Offline");
        socket.leave(userId);
      })
    })