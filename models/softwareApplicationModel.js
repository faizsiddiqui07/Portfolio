const mongoose = require('mongoose')

const softwareApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
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

const SoftwareApplication = mongoose.model("SoftwareApplication", softwareApplicationSchema)

module.exports = SoftwareApplication