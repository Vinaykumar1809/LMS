import {model,Schema} from 'mongoose';

const librarySchema = new Schema(
    {
        title:{
        type:String,
        required:[true,'Title is required'],
        minLength:[5,'Title must contain atleast 5 characters'],
        maxLength:[60,'Title should not exceed 60 characters'],
        trim:true
    },
    description:{
        type:String,
        maxLength:[500,'Description should not exceed 500 characters'],
        trim:true
    },
    category:{
        type:String,
         required:[true,'Category is required'],
    },
    thumbnail:{
            public_id:{
                    type:String,
                    required:true
                },
                secure_url:{
                    type:String,
                    required:true
                }
    },
    books:[
        {
            title:{
        type:String,
        required:[true,'Title is required'],
        minLength:[4,'Title must contain atleast 4 characters'],
        trim:true
    },

     thumbnail:{
            public_id:{
                    type:String,
                    required:true
                },
                secure_url:{
                    type:String,
                    required:true
                }
    },
    
    book:{
                public_id:{
                    type:String,
                    required:true
                },
                secure_url:{
                    type:String,
                    required:true
                }
            }
        }
],
numbersOfBooks:{
        type:Number,
        default:0
     },
    },{
        timestamps:true
    }
);

const Library = model('Library',librarySchema);

export default Library