import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

const getAllCourses = async(req,res,next)=>{

    try{
         const courses = await Course.find({}).select('-lectures');
    res.status(200).json({
       success:true,
       message:'All courses',
       courses, 
    })

    }catch(e){
     return next(
        new AppError('Failed to fetch courses',400)
     )
    }
   
}

const getLecturesByCourseId = async(req,res,next)=>{
   try{

    const {id} = req.params;
    const course = await Course.findById(id);
    if(!course){
        return next(
            new AppError('Course not found',400)
        )
    }
    res.status(200).json({
        success:true,
        message: 'Course lectures fetched successfully!',
        lectures:course.lectures
    })

   }catch(e){
    return next(
        new AppError('Failed to fetch Lectures',400)
     )
   }
}

const createCourse = async(req,res,next)=>{
    const {title,description,category,createdBy} = req.body;
    if(!title || !description || !category || !createdBy){
         return next(
            new AppError('All fields are required',400)
         )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:'Dummy',
            secure_url:'Dummy',
        }
    });

    if(!course){
        return next(
            new AppError('Failed to create course, please try again!',500)
        )
    }

    if(req.file){
        try{
             const result = await cloudinary.v2.uploader.upload(req.file.path,{
             folder: 'lms'
        });
        if(result){
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
        }

   await fs.rm(`uploads/${req.file.filename}`); 
        }catch(e){
             console.error("File upload/delete error:", e);
            return next(
                new AppError('',500)
            )
        }
        
    }

     await course.save();

     res.status(200).json({
        success:true,
        message:'Course created successfully!',
        course,
     });
}


const updateCourse = async(req,res,next)=>{
   try{
    const {id} = req.params;
    const course = await Course.findByIdAndUpdate(
       id,
       {
        $set:req.body
       },
       {
        runValidators:true
       }
    );

    if(!course){
        return next(
            new AppError('Course does not exist',500)
        )
    }

    res.status(200).json({
        success:true,
        message: 'Course updated successfully!',
        course,
    })

   }catch(e){
    return next(
        new AppError('Course updation failed!',500)
    )
   }

}


const removeCourse = async(req,res,next)=>{
   try{

    const {id} = req.params;
    const course = await Course.findById(id);

    if(!course){
        return next(
            new AppError('Course does not exist',500)
        )
    }

 await Course.findByIdAndDelete(id);

    res.status(200).json({
        success:true,
        message:'Course deleted successfully!'
    })
   }catch(e){
    return next(
        new AppError(e.message||'Course deletion failed!',500)
    )
   }
}

const addLectureToCourseById = async(req,res,next)=>{
    try{
           const {title,description} = req.body;
    const {id} = req.params;

    if(!title || !description ){
         return next(
            new AppError('All fields are required',400)
         )
    }

    const course = await Course.findById(id);
    if(!course){
        return next(
            new AppError('Course does not exist',500)
        )
    }

    const lectureData = {
        title,
        description,
        lecture:{}
    };

    if(req.file){
           try{
             const result = await cloudinary.v2.uploader.upload(req.file.path,{
             folder: 'lms',
             resource_type: 'auto'  
        });
        if(result){
            lectureData.lecture.public_id = result.public_id;
            lectureData.lecture.secure_url = result.secure_url;
        }

         await fs.rm(`uploads/${req.file.filename}`); 
        }catch(e){
            return next(
              new AppError(e.message || 'File upload failed', 500)
            )
        }
    }

    course.lectures.push(lectureData);
    course.numbersOfLectures = course.lectures.length;
    await course.save();

    res.status(200).json({
        success: true,
        message:'Lecture added successfully!',
        course
    })
    }catch(e){
        console.log("Error in uploading: ",e);
     return next(
        new AppError('Lecture uploading failed!',500)
     )
    }
    
}

const removeLectureFromCourseById = async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    const lecture = course.lectures.id(lectureId);
    if (!lecture) {
      return next(new AppError('Lecture not found', 404));
    }

    // Delete lecture media from Cloudinary if available
    if (lecture.lecture.public_id) {
     const result= await cloudinary.v2.uploader.destroy(lecture.lecture.public_id,{
   
  });
  console.log("Cloudinary deletion result:", result);
    }

    // Remove the lecture from the array
    course.lectures = course.lectures.filter(
      (lec) => lec._id.toString() !== lectureId
    );
    course.numbersOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lecture removed successfully!',
      course,
    });
  } catch (e) {
    console.log("Error in deleting: ",e);
    return next(new AppError('Failed to remove lecture', 500));
  }
};


export{
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLectureFromCourseById
}