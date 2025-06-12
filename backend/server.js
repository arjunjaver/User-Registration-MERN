const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Mongoose connected"))
.catch((error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
});

app.post("/api/user", async(req,res)=>{
  try{
    const {fullName,email,password,mobile,age,address} = req.body;

    if(!fullName || !email || !password || !mobile || !age || !address){
      return res.status(400).json({error:"all fields required"});
    }

    const user = new User({fullName,email,password,mobile,age,address});
    await user.save();

    res.status(201).json({message:"user added successfully",user});
  }catch(error){
    console.error("Error adding user",error);
    res.status(500).json({error:"internal server error"})
  }
})

app.get("/api/user", async(req,res)=>{
  try{
    const users = await User.find();
    res.status(200).json({users});
  }catch(error){
    console.error("error feching user",error);
    res.status(500).json({error:'internal server error'});
  }
});

app.get("/api/user/:id", async(req,res)=>{
  try{
    
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(404).json({error:"user not found"});
    }
    res.json(user);
  }catch(error){
    console.error("error fetching user ", error);
    res.status(500).json({error:'internal server error'});
  }
});

app.put("/api/user/:id", async(req,res)=>{
  try{
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(req.params.id, updates, {new: true});

    if(!user){
      res.status(404).json({error:'user not found'});
    }

    res.json({message:'user updated successfully',user});
  }catch(error){
    console.error("error updating user",error);
    res.status(500).json({error:"internal server error"});
  }  
});

app.delete("/api/user/:id", async(req,res)=>{
  try{
    
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
      return res.status(404).json({error:"user not found"});
    }
    res.json({message:"user deleted successfully"});
  }catch(error){
    console.error("error deleting user",error);
    res.status(500).json({error:"internal serrver error"});
  }
});

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`);
})
