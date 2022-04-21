const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    category_name:{
        type:String,
        required:true,
    },
});

//collection creation
const category=new mongoose.model("category",categorySchema);

module.exports=category;