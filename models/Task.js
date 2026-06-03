const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    date:String,
    task:String,
    due:String,
    delegate:String,
    remind:String,
    status:String,
    link:String

});

module.exports = mongoose.model("Task",taskSchema);