const User = require('../models/userModel');
const { v2: cloudinary } = require('cloudinary');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/jwtToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


const register = async (req, res) => {
    try {

        const { fullName, email, phone, aboutMe, password, portfolioURL, githubURL, instagramURL, linkedInURL, facebookURL } = req.body;
        const { avatar, resume } = req.files;
        

        if (!req.files || !req.files.avatar || !req.files.resume) {
            return res.status(400).json({
                message: "Avatar and Resume are required!"
            });
        }

        let cloudinaryResponseForAvatar;
        try {
            cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
                avatar.tempFilePath,
                { folder: "AVATARS" }
            );
        } catch (error) {
            console.error("Avatar upload error:", error);
            return res.status(500).json({ message: "Failed to upload avatar." });
        }

        let cloudinaryResponseForResume;
        try {
            cloudinaryResponseForResume = await cloudinary.uploader.upload(
                resume.tempFilePath,
                { folder: "MY_RESUME" }
            );
        } catch (error) {
            console.error("Resume upload error:", error);
            return res.status(500).json({ message: "Failed to upload resume." });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters!",
            });
        }


        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            phone,
            aboutMe,
            password: hashedPassword,
            portfolioURL,
            githubURL,
            instagramURL,
            linkedInURL,
            facebookURL,
            avatar: {
                public_id: cloudinaryResponseForAvatar.public_id,
                url: cloudinaryResponseForAvatar.secure_url
            },
            resume: {
                public_id: cloudinaryResponseForResume.public_id,
                url: cloudinaryResponseForResume.secure_url
            },
        });

        generateToken(user, "User Resistered Success", 201, res)

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "An unexpected error occurred. Please try again."
        });
    }
};

const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required!",
                success: false,
                error: true
            })
        }

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        generateToken(user, "Logged In", 200, res)


    } catch (error) {
        console.error("login error:", error);
        return res.status(500).json({
            message: "An unexpected error occurred. Please try again."
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true });

        return res.status(200).json({
            success: true,
            error: false,
            message: "Successfully logged out."
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            error: true,
            message: "An error occurred during logout. Please try again."
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve user data. Please try again later.",
        });
    }
};

const updateProfile = async (req, res) => {
    
    try {
        const userId = req.user._id;        
        

        const newUserData = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            aboutMe: req.body.aboutMe,
            portfolioURL: req.body.portfolioURL,
            githubURL: req.body.githubURL,
            instagramURL: req.body.instagramURL,
            linkedInURL: req.body.linkedInURL,
            facebookURL: req.body.facebookURL,
        };


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        if (req.files?.avatar) {
            const avatar = req.files.avatar;
            if (user.avatar?.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }
            const avatarUpload = await cloudinary.uploader.upload(avatar.tempFilePath, {
                folder: "AVATARS",
            });
            newUserData.avatar = {
                public_id: avatarUpload.public_id,
                url: avatarUpload.secure_url,
            };
        }


        if (req.files?.resume) {
            const resume = req.files.resume;
            if (user.resume?.public_id) {
                await cloudinary.uploader.destroy(user.resume.public_id);
            }
            const resumeUpload = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder: "MY_RESUME",
            });
            newUserData.resume = {
                public_id: resumeUpload.public_id,
                url: resumeUpload.secure_url,
            };
        }


        const updatedUser = await User.findByIdAndUpdate(userId, newUserData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the profile. Please try again later.",
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters!",
            });
        }

        const user = await User.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the password. Please try again later.",
        });
    }
};

const getUserForPortfolio = async (req, res) => {
    try {
        const userId = "6723c54ee47fc74312ef5e05";
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            error: false,
            user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            error: true,
            message: "Server error. Please try again later.",
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
        const message = `You requested a password reset.\n\nPlease use the following link to reset your password:\n${resetPasswordUrl}\n\nIf you did not request this, please ignore this email.`;

        await sendEmail({
            email: user.email,
            subject: "Password Recovery for Your Dashboard",
            message,
        });

        res.status(200).json({
            success: true,
            message: `An email has been sent to ${user.email} with instructions to reset your password.`,
        });
    } catch (error) {
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};

const resetPassword = async (req, res) => {
    
    try {
        const { token } = req.params;
        console.log("token",token);
        
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset password token is invalid or has expired.",
            });
        }

        const { password, confirmPassword } = req.body;

        // Ensure password fields are provided and match
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Both password and confirm password are required.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match.",
            });
        }

        // Check if password meets length requirement
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters!",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        // Save user
        await user.save();

        return generateToken(user, "Password reset successfully", 200, res);
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred. Please try again later.",
        });
    }
};




module.exports = {
    register,
    login,
    logout,
    getUser,
    updateProfile,
    updatePassword,
    getUserForPortfolio,
    forgotPassword,
    resetPassword
};
