const Skill = require('../models/skillModel')
const { v2: cloudinary } = require('cloudinary');

const addNewSkill = async (req, res) => {
    
    try {
        const { title, proficiency } = req.body;
        const { icon } = req.files;

        if (!icon) return res.status(400).json({ message: "Skill icon is required!" });
        if (!title || !proficiency) return res.status(400).json({ message: "Please fill out the complete form!" });


        const cloudinaryResponse = await cloudinary.uploader.upload(icon.tempFilePath, {
            folder: "PORTFOLIO_SKILL_ICON",
        });

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown cloudinary error");
            return res.status(500).json({ message: "Error with Cloudinary upload." });
        }

        const skill = await Skill.create({
            title,
            proficiency,
            icon: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        });

        return res.status(201).json({
            success: true,
            message: "New skill added successfully!",
            skill
        });
    } catch (error) {
        console.error("Error adding new skill:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the skill. Please try again later."
        });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const skill = await Skill.findById(id);
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found!"
            });
        }

        const { public_id: skillIconId } = skill.icon;

        try {
            await cloudinary.uploader.destroy(skillIconId);
        } catch (cloudinaryError) {
            console.error("Cloudinary delete error:", cloudinaryError);
            return res.status(500).json({
                success: false,
                message: "Failed to delete skill icon from Cloudinary."
            });
        }

        await skill.deleteOne();

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully!"
        });
    } catch (error) {
        console.error("Delete skill error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the skill."
        });
    }
}

const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { proficiency } = req.body;
        const icon = req.files?.icon;

        if (!proficiency) {
            return res.status(400).json({
                success: false,
                message: "Proficiency is required for updating the skill."
            });
        }

        const skill = await Skill.findById(id);
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found!"
            });
        }

        let updatedIcon = skill.icon;
        if (icon) {
            try {
                await cloudinary.uploader.destroy(skill.icon.public_id);

                const cloudinaryResponse = await cloudinary.uploader.upload(icon.tempFilePath, {
                    folder: "PORTFOLIO_SKILL_ICON",
                });

                updatedIcon = {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url
                };
            } catch (error) {
                console.error("Icon upload error:", error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload the new icon."
                });
            }
        }

        skill.proficiency = proficiency;
        skill.icon = updatedIcon;
        await skill.save();

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            skill
        });
    } catch (error) {
        console.error("Error updating skill:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the skill. Please try again later."
        });
    }
};

const getAllSkill = async (req, res) => {
    try {
        const skills = await Skill.find();

        if (!skills.length) {
            return res.status(404).json({
                success: false,
                message: "No skills found."
            });
        }

        res.status(200).json({
            success: true,
            message: "All Skills retrieved successfully.",
            skills
        });
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching skills. Please try again later."
        });
    }
};


module.exports = {
    addNewSkill,
    deleteSkill,
    updateSkill,
    getAllSkill
}