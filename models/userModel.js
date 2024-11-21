const mongoose = require('mongoose')
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is Required"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"]
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Required"]
    },
    aboutMe: {
        type: String,
        required: [true, "About Me is Required"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minLength: [8, "Password must contain at least 8 characters!"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    portfolioURL: {
        type: String,
        required: [true, "Portfolio URL Is Required"]
    },
    githubURL: String,
    linkedInURL: String,
    facebookURL: String,
    instagramURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: String
}, {
    timestamps: true
})

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex"); 

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;
};

const User = mongoose.model("User", userSchema)

module.exports = User