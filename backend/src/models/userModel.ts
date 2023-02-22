import {Schema,model} from "mongoose"

const userSchema = new Schema(
    {
        name:{
            type:String,
            required: [true,"please add a name"]
        },
        email:{
            type:String,
            required: [true,"please add a email"],
            unique:true
        },
        password:{
            type:String,
            required: [true,"please add a password"]
        },
        picture:String
    },
    {
        timestamps:true
    }
)

export default model("User",userSchema)