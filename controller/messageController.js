const Message = require('../models/messageModel')

const sendMessage = async (req, res) => {
    try {
        const { senderName, subject, message } = req.body;

        if (!senderName || !subject || !message) {
            return res.status(400).json({
                message: 'Please fill in all required fields',
                error: true,
                success: false
            });
        }

        const data = await Message.create({ senderName, subject, message });

        return res.status(201).json({
            data,
            message: 'Message sent successfully',
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : 'Failed to send message',
            error: true,
            success: false,
        });
    }
};

const getAllMessage = async (req, res) => {
    try {
        const message = await Message.find()
        res.status(200).json({
            success: true,
            error: false,
            message
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false,
        });
    }
}

const deleteMessage = async (req, res) => {
    console.log("calling...");
    
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndDelete(id)
        if (!message) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Message not found"
            })
        }
        res.status(200).json({
            success: true,
            error: false,
            message: "Message deleted"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to delete message",
            error: true,
            success: false,
        });
    }
}


module.exports = {
    sendMessage,
    getAllMessage,
    deleteMessage
}