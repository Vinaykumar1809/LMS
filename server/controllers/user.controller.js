import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from '../utils/sendEmail.js'; 
import crypto from 'crypto';

const cookieOptions = {
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true,
    sameSite: 'None'
};

const register = async (req,res,next)=>{
  const {fullName,email,password} = req.body;
  if(!fullName || !email || !password){
     return next(new AppError('All fields are required',400));
  }

  const userExists = await User.findOne({email});

  if(userExists){
    return next(new AppError('This Email is already registered',400));
  }

   const user = await User.create({
    fullName,
    email,
    password,
    avatar:{
        public_id:'profile-icon_a2nv0v',
        secure_url:'https://res.cloudinary.com/dez3kgihc/image/upload/v1750736537/profile-icon_a2nv0v.png'
    }
   });

   if(!user){
    return next(new AppError('User registration failed, please try again',400));
   }

   if(req.file){
      try{
        const result = await cloudinary.v2.uploader.upload(req.file.path,{
          folder: 'lms',
          width:250,
          height:250,
          gravity:'faces',
          crop: 'fill'
        })  ;

        if(result){
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          //Remove file from server
        await fs.rm(`uploads/${req.file.filename}`);

        }

      }catch(e){
             return next (
              new AppError(e.message || 'file not uploaded,please try again',500)
             )
      }
   }

   await user.save();

   user.password = undefined;

   const token = await user.generateJWTToken();

   res.cookie('token',token,cookieOptions);

   res.status(201).json({
      success:true,
      message: 'User registered successfully',
      user,
   });

};


const login = async(req,res,next)=>{
    try{  
         const {email,password} = req.body;

  if(!email || !password){
    return next(new AppError('All fields are required',400));
  }

  const user = await User.findOne({
     email
  }).select('+password');

  if(!user || !user.comparePassword(password)){
    return next(new AppError('Email or password is incorrect',400))
  }

  const token = await user.generateJWTToken();
  user.password=undefined;

  res.cookie('token',token,cookieOptions);

  res.status(200).json({
    success:true,
    message:'User logged in successfully',
    user,
  });
 } catch(e){
        return next(new AppError(e.message,500));
    }

 
};

const logout = (req,res)=>{
  res.cookie('token',null,{
    secure:true,
    maxAge:0,
    httpOnly:true
  });

    res.status(200).json({
        success:true,
        message:'User logged out successfully'
    })
};

const getProfile = async (req,res,next)=>{
    try{
        const userId = req.user.id;
     const user = await User.findById(userId);

     res.status(200).json({
        success:true,
        message:'User details',
        user
     });
    }
    catch(e){
        return next(new AppError('Failed to fetch profile',500))
    }
};

const forgotPassword = async (req,res,next) =>{
  const {email} = req.body;
  if(!email){
    return next(new AppError('Email is required ',400));
  }

  const user = await User.findOne({email});
  if(!user){
    return next(new AppError('Email not registered',400))
  }
   
  const resetToken = await user.generatePasswordResetToken();
  
  await user.save();
  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const subject = 'Reset Password';
  const message = `<b>You can reset your password by clicking</b> <a href="${resetPasswordURL}" target="_blank">Reset your password</a>.<br><br>If the above link does not work, copy and paste this link into your browser: <br> ${resetPasswordURL}.<br><br><br>If you did not request this, please ignore.`;

  try{
    await sendEmail(email,subject,message);
    res.status(200).json({
      success:true,
      message: `Reset password link has been sent to ${email} `
    })
  }catch(e){
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined; 

    return next (new AppError(e.message,500));
  }
}

const resetPassword = async (req,res,next)=>{
   const {resetToken} = req.params;

   const {password} = req.body;

   const forgotPasswordToken = crypto
   .createHash('sha256')
   .update(resetToken)
   .digest('hex');

  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: {$gt: Date.now()}
  }) ;
 
  if(!user){
    return next(
    new AppError('Link is invalid or expired,please try again',400)
    );
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({
    success:true,
    message: 'Password changed successfully!'
  })

}

const changePassword=async(req,res,next) =>{
   const{oldPassword,newPassword} = req.body;
   if(!oldPassword ||!newPassword){
    return next(
      new AppError('All fields are mandatory',400)
    )
   }

   const user = await User.findById(req.user.id).select('+password');
   if(!user){
  return next( new AppError('User does not exist',400));
   }

   const isPasswordValid = await user.comparePassword(oldPassword);
   if(!isPasswordValid){
    return next(
      new AppError('Invalid old password',400)
    )
   }

   user.password = newPassword;
   await user.save();
     
   user.password = undefined;
   res.status(200).json({
    success:true,
    message: 'Password changed successfully!'
   })
}

const updateUser = async(req,res,next)=>{
    const {fullName} = req.body;
    const {id} = req.params;

    const user = await User.findById(id);
    if(!user){
      return next(
        new AppError('User does not exist',400)
      )
    }

    if(fullName){
      user.fullName = fullName;
    }

    if(req.file){
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      try{
        const result = await cloudinary.v2.uploader.upload(req.file.path,{
          folder: 'lms',
          width:250,
          height:250,
          gravity:'faces',
          crop: 'fill'
        })  ;

        if(result){
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          //Remove file from server
          fs.rm(`uploads/${req.file.filename}`);

        }

      }catch(e){
             return next (
              new AppError(e || 'file not uploaded,please try again',500)
             )
      }
    }

    await user.save();
    res.status(200).json({
            success: true,
            message: 'User details updated successfully!'
    });

}

export{
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}
