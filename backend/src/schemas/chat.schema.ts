import {Schema, model} from 'mongoose'

const Message=new Schema({
    message_id:{
        type: String, 
        required:true
    }, 
    text:{
        type:String,
        min_length:0, 
        max_length:3000
    },
    date_time:{
        type: Date,
        required:true
    }
})
const ChatSchema=new Schema({
    name:{
        type: String,
        required:true
    },
    User_Id:{
    type: String,
    required: true    
    },

messages: [Message]
});
export default model('Chat', ChatSchema)