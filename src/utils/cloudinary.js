import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const fileUploadOnCloudinary = async function (localFilePath) {
    try {
        if (!localFilePath) {
            console.log("path is not found")
            return null
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded on cloudinary
        console.log("file has been Uploaded on cloudinary ", response.url)
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export { fileUploadOnCloudinary };