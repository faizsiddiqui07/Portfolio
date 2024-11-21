const Timeline = require("../models/timelineModel");

const postTimeLine = async (req, res) => {
    
    try {
        const { title, description, from, to } = req.body;

        if (!title || !description || !from) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const newTimeline = await Timeline.create({
            title,
            description,
            timeline: { from, to }
        });

        res.status(201).json({
            success: true,
            message: "Timeline added successfully.",
            data: newTimeline
        });
    } catch (error) {
        console.error("Error in postTimeLine:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the timeline. Please try again later."
        });
    }
};

const deleteTimeline = async (req, res) => {
    try {
        const { id } = req.params;

        const timeline = await Timeline.findById(id);
        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: "Timeline not found!"
            });
        }

        await timeline.deleteOne();
        res.status(200).json({
            success: true,
            message: "Timeline deleted successfully!"
        });
    } catch (error) {
        console.error("Error in deleteTimeline:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the timeline. Please try again later."
        });
    }
};

const getAllTimeline = async (req, res) => {
    try {
        const timelines = await Timeline.find();

        if (!timelines.length) {
            return res.status(404).json({
                success: false,
                message: "No timelines found."
            });
        }

        res.status(200).json({
            success: true,
            timelines
        });
    } catch (error) {
        console.error("Error in getAllTimeline:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving timelines. Please try again later."
        });
    }
};


module.exports = {
    postTimeLine,
    deleteTimeline,
    getAllTimeline
}