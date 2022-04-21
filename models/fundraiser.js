const mongoose=require("mongoose");

const fundraiserSchema=new mongoose.Schema({
    userid:{
        type:Object,
        required:false,
    },
    catid:{
        type:Object,
        required:false,
    },
    proj_title:{
        type:String,
        required:true,
    },
    created_date:{
        type:Date,
        default:Date(),
    },
    end_date:{
        type:Date,
        required:true,
    },
    target_amt:{
        type:Number,
        required:true,
    },
    proj_desc:{
        type:String,
        required:true,
    },
    upi_id:{
        type:String,
        required:true,
    },
    status:{
        type:Number,
        default:0,
    }
});

//collection creation
const fundraiser=new mongoose.model("fundraiser",fundraiserSchema);

module.exports=fundraiser;