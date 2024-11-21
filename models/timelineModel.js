const mongoose = require('mongoose')

const timelineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timeline: {
        from: {
            type: String,
            required: true
        },
        to: String
    },
}, {
    timestamps: true
})

const Timeline = mongoose.model("Timeline", timelineSchema)

module.exports = Timeline