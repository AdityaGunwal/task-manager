require("dotenv").config();
const express = require("express");
const path = require("path");
const Task = require("./models/Task");
const User = require("./models/User");
const auth = require("./middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
    console.log("Server running");
});

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));
app.get("/api/tasks",auth,async(req,res)=>{

    const tasks=
    await Task.find({

        userId:req.user.id

    });

    res.json(tasks);

});

app.post("/api/tasks",auth,async(req,res)=>{

    const task=
    await Task.create({

        ...req.body,

        userId:req.user.id

    });

    res.json(task);

});

app.put("/api/tasks/:id",auth,async(req,res)=>{

    const task=
    await Task.findOneAndUpdate(

        {
            _id:req.params.id,
            userId:req.user.id
        },

        req.body,

        {
            new:true
        }

    );

    res.json(task);

});

app.delete("/api/tasks/:id",auth,async(req,res)=>{

    await Task.findOneAndDelete({

        _id:req.params.id,

        userId:req.user.id

    });

    res.json({
        message:"Deleted"
    });

});


app.post("/api/signup", auth, async (req,res)=>{

    const {username,password}=req.body;

    const hashedPassword =
    await bcrypt.hash(password,10);

    const user = await User.create({
        username,
        password:hashedPassword
    });

    res.json(user);

});

app.post("/api/login", auth, async(req,res)=>{

    const {username,password}=req.body;

    const user =
    await User.findOne({username});

    if(!user)
        return res.status(400)
        .json({message:"User not found"});

    const ok =
    await bcrypt.compare(
        password,
        user.password
    );

    if(!ok)
        return res.status(400)
        .json({message:"Wrong password"});

    const token =
    jwt.sign(
        {
            id:user._id
        },
        SECRET
    );

    res.json({
        token
    });

});