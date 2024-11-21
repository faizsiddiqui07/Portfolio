const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        minLength: [2, "Name must contain atleast 2 charecters!"],
    },
    subject: {
        type: String,
        minLength: [2, "Subject must contain atleast 2 charecters!"],
    },
    message: {
        type: String,
        minLength: [2, "Message must contain atleast 2 charecters!"],
    }
}, {
    timestamps: true
})

const Message = mongoose.model("Message",messageSchema)

module.exports = Message