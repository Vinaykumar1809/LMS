import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

const isLoggedIn = async (req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new AppError('Unauthenticated, please login again',401))
    }

    const userDetails = await jwt.verify(token,process.env.JWT_SECRET);
    req.user = userDetails;

    next();
};

const authorizedRoles = (...roles) =>async(req,res,next)=>{
    const currentUserRole = req.user.role;

    if(!roles.includes(currentUserRole)){
         return next(
            new AppError('Access Denied!!',400)
         )
    }
    next();
};

const authorizeSubscriber = async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    if(user.role !== 'ADMIN' && user.subscription.status !== 'active'){
        return next(
            new AppError('Please subscribe to access the lectures',403)
        )
    }
    next();
};

export{
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber
}