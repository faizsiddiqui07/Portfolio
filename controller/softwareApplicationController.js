const SoftwareApplication = require('../models/softwareApplicationModel')
const { v2: cloudinary } = require('cloudinary');


const addNewApplication = async (req, res) => {
    const { name } = req.body;

    if (!req.files?.icon) {
        return res.status(400).json({ message: "Software icon is required!" });
    }

    if (!name) {
        return res.status(400).json({ message: "Software name is required!" });
    }

    const { icon } = req.files;
    let cloudinaryResponse;

    try {
        cloudinaryResponse = await cloudinary.uploader.upload(icon.tempFilePath, {
            folder: "PORTFOLIO_SOFTWARE_APPLICATION",
        });
    } catch (error) {
        console.error("Icon upload error:", error);
        return res.status(500).json({ message: "Failed to upload icon." });
    }

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown cloudinary error");
        return res.status(500).json({ message: "Error with Cloudinary upload." });
    }

    try {
        const softwareApplication = await SoftwareApplication.create({
            name,
            icon: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        });

        return res.status(201).json({
            message: "New software application added!",
            success: true,
            softwareApplication,
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ message: "Failed to save application in the database." });
    }
};

const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const softwareApplication = await SoftwareApplication.findById(id);
        if (!softwareApplication) {
            return res.status(404).json({
                success: false,
                message: "Software Application not found!"
            });
        }

        const { public_id: softwareApplicationIconId } = softwareApplication.icon;

        try {
            await cloudinary.uploader.destroy(softwareApplicationIconId);
        } catch (cloudinaryError) {
            console.error("Cloudinary delete error:", cloudinaryError);
            return res.status(500).json({
                success: false,
                message: "Failed to delete software icon from Cloudinary."
            });
        }

        await softwareApplication.deleteOne();

        res.status(200).json({
            success: true,
            message: "Software Application deleted successfully!"
        });
    } catch (error) {
        console.error("Delete application error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the application."
        });
    }
};

const getAllApplication = async (req, res) => {
    try {
        const softwareApplication = await SoftwareApplication.find();

        if (!softwareApplication.length) {
            return res.status(404).json({
                success: false,
                message: "No software applications found."
            });
        }

        res.status(200).json({
            success: true,
            message:"Software applications retrieved successfully.",
            softwareApplication
        });
    } catch (error) {
        console.error("Error in softwareApplication:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving softwareApplication. Please try again later."
        });
    }
};


module.exports = {
    addNewApplication,
    deleteApplication,
    getAllApplication
}