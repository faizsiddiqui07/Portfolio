const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    proficiency: String,
    icon: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true
})

const Skill = mongoose.model("Skill", skillSchema)

module.exports = Skill