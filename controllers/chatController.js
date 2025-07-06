const Chat=require("../models/Chat");
const User=require("../models/User");
module.exports = {
    accessChat:async(req,res)=>{
        const {userId}=req.body;
        if(!userId){
            res.status(400).json("Invalid user Id");
        }

        var isChat=await Chat.find({
            isGroupChat: false,
            $and:[
                {users:{$elemMatch:{$eq:req.user.id}}},
                {users:{$elemMatch:{$eq:userId}}},
            ]
        }).populate("users","-password").populate("latestMessage");
        isChat=await User.populate(isChat,{
            path:"latestMessage.sender",
            select:"username profile email"
        });
        if(isChat.length>0){
            return res.status(200).send(isChat[0]);
        }else{
            var chatData={
                chatName: req.user.id,
                isGroupChat: false,
                users: [req.user.id, userId],
            };
            try{
                var createdChat=await Chat.create(chatData);
                var FullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password");
                return res.status(200).send(FullChat);
            }catch(err){
                return res.status(400).json({error:"Chat creation failed"});
            }
        }
    },
    getChat:async(req,res)=>{
        try{
            Chat.find({users:{$elemMatch:{$eq:req.user.id}}})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
            .sort({updatedAt: -1})
            .then(async(results)=>{
                results=await User.populate(results,{
                    path:"latestMessage.sender",
                    select:"username profile email"
                });
                res.status(200).send(results);
            })
    }catch(err){
            res.status(500).json({error:"Could not fetch chats"});
        }
    }
}