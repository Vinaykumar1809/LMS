import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [5, 'Name must consist of at least 5 characters'],
        maxLength: [50, "Name shouldn't exceed 50 characters"],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill in a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
        },
        secure_url: {
            type: String,
           
        }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
    id: {
        type: String,
        default: null
        //default: 'default_subscribed_id'  // Or null if you want it empty but defined
    },
    status: {
        type: String,
         default: null
        //default: 'active'  // Indicate that the user is a subscriber
    }
}

}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.generateJWTToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            subscription: this.subscription,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
};

userSchema.methods.comparePassword = function (plainTextPassword) {
    return bcrypt.compare(plainTextPassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

const User = model('User', userSchema);

export default User;
