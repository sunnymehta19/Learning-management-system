const {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary,
} = require("../../helper/cloudinary");

// Upload Single File
const uploadMedia = async (req, res) => {
    try {
        const result = await uploadMediaToCloudinary(req.file.path);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            success: false,
            message: "Error uploading file",
        });
    }
};

// Delete File
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Asset Id is required",
            });
        }

        await deleteMediaFromCloudinary(id);

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully from cloudinary",
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            success: false,
            message: "Error deleting file",
        });
    }
};

// Bulk Upload
const bulkUploadMedia = async (req, res) => {
    try {
        const uploadPromises = req.files.map((fileItem) =>
            uploadMediaToCloudinary(fileItem.path)
        );

        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            success: false,
            message: "Error in bulk uploading files",
        });
    }
};

module.exports = {
    uploadMedia,
    deleteMedia,
    bulkUploadMedia,
};      