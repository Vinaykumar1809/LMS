import {model,Schema} from 'mongoose';

const courseSchema = new Schema ({
    title:{
        type:String,
        required:[true,'Title is required'],
        minLength:[5,'Title must contain atleast 5 characters'],
        maxLength:[60,'Title should not exceed 60 characters'],
        trim:true
    },
    description:{
        type:String,
          required:[true,'Description is required'],
        minLength:[5,'Description must contain atleast 5 characters'],
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
    lectures:[
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
          required:[true,'Description is required'],
        minLength:[5,'Description must contain atleast 5 characters'],
        trim:true
    },
            lecture:{
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
     numbersOfLectures:{
        type:Number,
        default:0
     },
     createdBy:{
        type:String,
        required:true
     }
},{
    timestamps:true
});

const Course = model('Course',courseSchema);

export default Course;