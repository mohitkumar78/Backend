import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const Userschema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        index: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cludinary url
        required: true,


    },
    coverImage: {
        type: String // cloudinary url
    },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },


}, {
    timestamps: true
});
async function getHashedPassword(userId) {
    try {
        const user = await User.findById(userId);

        if (user) {
            const hashedPassword = user.password;
            console.log('Retrieved Hashed Password:', hashedPassword);
            return hashedPassword;
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error retrieving hashed password:', error);
    }
}

Userschema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        console.log(this.password);

    }
    next();
})
Userschema.methods.isPasswordCorrect = async function (password, userid) {
    const hashedPassword = await getHashedPassword(userid);
    console.log(password);
    console.log(hashedPassword);
    return await bcrypt.compare(password, hashedPassword)
}

Userschema.methods.generateAccessToken = function () {
    console.log('Environment Variables:', process.env);

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            // ... other user data
        },
        process.env.ACCESS_TN_SECREOKET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

Userschema.methods.generateRefreshToken = function () {
    console.log('Environment Variables:', process.env);

    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", Userschema);
