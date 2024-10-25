import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilesPath) => {
    try {
        if (!localFilesPath) return null
        const response = await cloudinary.uploader.upload(localFilesPath, {
            resource_type:"auto",
            chunk_size: 6000000,
        })
        fs.unlinkSync(localFilesPath)
        return response;
    } 
    catch (error) {
        fs.unlinkSync(localFilesPath)
        return isNull;
    }
}

export {uploadOnCloudinary}