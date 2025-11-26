const Chat = require("../models/Chat");
const Message=require("../models/Message");
const User=require("../models/User")
module.exports = {
    getAllMessage: async(req,res)=>{
        try{
            const pageSize=12;//Number of messages per page
            const page=req.query.page || 1;// Current page number
            //calculate the number of messages to skip
            const skipMessages=(page-1)*pageSize;

            //Find messages with pagination
            var messages= await Message.find({
                chat:req.params.id
            })
            .populate("sender","username profile email")
            .populate("chat")
            .sort({createdAt: -1})//Sort messages by descending order
            .skip(skipMessages)//skip messages based on pagination
            .limit(pageSize);
            messages=await User.populate(messages,{
                path:"chat.users",
                select:"username profile email",
            });
            res.json(messages);
        }catch(err){
            res.status(500).json({error:"Could  not fetch messages"});
        }
    },

    sendMessage: async(req,res)=>{
        const {content,chatId, receiver}=req.body;
        if(!content || !chatId){
            console.log("Invalid Data");
            return res.status(400).json({error:error});
        }
        var newMessage={
            sender: req.user.id,
            content: content,
            receiver:receiver,
            chat:chatId
        };
        try{
            var message=await Message.create(newMessage);
            message=await message.populate("sender","username, profile email")
            message=await message.populate("chat")
            message=await User.populate(message,{
                path:"chat.users",
                select:"username, profile email",
            });
                await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message});

                res.json(message);
        }catch(err){
            res.status(400).json({error:err.message});
        }
    }
}