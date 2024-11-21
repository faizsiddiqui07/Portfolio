const jwt = require('jsonwebtoken');

const generateToken = (user, message, statusCode, res) => {
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES });

        res.status(statusCode)
            .cookie("token", token, {
                expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: "None",
                secure: true
            })
            .json({
                success: true,
                error: false,
                message,
                user,
                token
            });
    } catch (error) {
        console.error("Token generation error:", error);
        res.status(500).json({
            success: false,
            error: true,
            message: "Failed to generate token. Please try again.",
        });
    }
};

module.exports = generateToken;
