const express  =  require("express");
const dotenv = require("dotenv").config()
const db = require("./config/db")
const chats = require("./data/data");
const colors = require("colors")
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const cores = require("cors")
const path = require("path")
const messageRoute = require("./routes/messageRoute")
const {notFound,errorHandler} = require("./middleware/errorMiddlewares")
db();
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cores({
    origin:"http://localhost:3000",
}))


app.use('/user',userRoute)
app.use('/chat',chatRoute)
app.use('/message',messageRoute)

//deployment 


const _directory = path.resolve();
if(process.env.NODE_ENV === 'production'){

    app.use(express.static(path.join(_directory,'/client/build')));
    app.get("*",(req,res)=>{
        res.sendFile(path.relative(_directory,"client","build","index.html"))
    })
}else{

    app.get('/',(req,res)=>{

        res.send('Api runnign successfully')
    })
}


//deployment 


app.use(notFound);
app.use(errorHandler)


const PORT  = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{

    console.log(`server started on port ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server,{

    pingTimeout:90000,
    cors:{
        origin:"http://localhost:3000",
        
    }
});

io.on("connection",(socket)=>{


    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected")
    });

    socket.on("join chat",(room)=>{

        socket.join(room);
        console.log('user joined',room);
    })


    socket.on("newMessage",(newMessage)=>{

        let chat  = newMessage.chat;
        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user=>{

            if(user._id == newMessage.sender._id) return;

            socket.in(user._id).emit("message recived",newMessage)
        });
    })

    socket.on("typing",(room)=>{

        socket.in(room).emit("typing")
    })
     socket.on("stop typing",(room)=>{

        socket.in(room).emit("stop typing")
    })

    socket.off("setup",(userData)=>{
        console.log('user disconnected');
        socket.leave(userData._id);
    })
})
