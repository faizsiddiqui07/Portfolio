const Project = require('../models/projectModel')
const { v2: cloudinary } = require('cloudinary')

const addNewProject = async (req, res) => {
    try {
        if (!req.files || !req.files?.projectBanner) {
            return res.status(400).json({ message: "Project Banner Image Required!" })
        }

        const { projectBanner } = req.files;

        const { title, description, gitRepoLink, projectLink, technologies, stack, deployed } = req.body;
        if (!title || !description || !gitRepoLink || !projectLink || !technologies || !stack || !deployed) {
            return res.status(400).json({ message: "Please Provide All Details!" })
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(projectBanner.tempFilePath,
            { folder: "PROJECT_IMAGES" }
        )

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log("Cloudinary Error:", cloudinaryResponse.error.message || "Unknown Cloudinary Error");
            return res.status(500).json({ message: "Failed to upload project banner to Cloudinary" })
        }

        const project = await Project.create({
            title,
            description,
            gitRepoLink,
            projectLink, 
            technologies,
            stack,
            deployed,
            projectBanner: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }
        })
        res.status(201).json({
            success: true,
            message: "New Project Added Successfully!",
            project
        })
    } catch (error) {
        console.error("Error adding new project:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the project. Please try again later."
        });
    }
}

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const newProductData = {
            title: req.body.title,
            description: req.body.description,
            gitRepoLink: req.body.gitRepoLink,
            projectLink: req.body.projectLink,
            technologies: req.body.technologies,
            stack: req.body.stack,
            deployed: req.body.deployed
        }
        if (req.files && req.files?.projectBanner) {
            const projectBanner = req.files.projectBanner;

            if (project.projectBanner?.public_id) {
                await cloudinary.uploader.destroy(project.projectBanner.public_id);
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(
                projectBanner.tempFilePath, {
                folder: "PROJECT_IMAGES"
            });
            newProductData.projectBanner = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            };
        }
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, newProductData, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            updatedProject
        })
    }
    catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the project. Please try again later.",
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.projectBanner?.public_id) {
            await cloudinary.uploader.destroy(project.projectBanner.public_id);
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully!",
        });

    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the project. Please try again later.",
        });
    }
};

const getAllProject = async (req, res) => {
    try {
        const projects = await Project.find()
        res.status(200).json({
            success: true,
            projects
        })
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving projects. Please try again later.",
        });
    }
}

const getSingleProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the project. Please try again later.",
        });
    }
};




module.exports = {
    addNewProject,
    deleteProject,
    updateProject,
    getAllProject,
    getSingleProject
}