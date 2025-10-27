import {v2 as cloudinary} from 'cloudinary';
import {fs} from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadImage = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('File path is required');
    }
    const result = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
    // Optionally, delete the local file after upload
    return result;
} catch (error) {
    fs.unlinkSync(filePath)
    return { error: error.message  } ;
  }     
};

export const deleteImage = async (publicId) => {
  try {
    if (!publicId) {                        
        throw new Error('Public ID is required');
    }
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
    return result;
  } catch (error) {
    return { error: error.message };
  }         
};

export const uploadMultipleImages = async (filePaths) => {
  try {
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
        throw new Error('An array of file paths is required');
    }
    const uploadPromises = filePaths.map((filePath) => 
        cloudinary.uploader.upload(filePath, { resource_type: "auto" })
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteMultipleImages = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
        throw new Error('An array of public IDs is required');
    }
    const deletePromises = publicIds.map((publicId) => 
        cloudinary.uploader.destroy(publicId, { resource_type: "auto" })
    );
    const results = await Promise.all(deletePromises);
    return results;
  }
    catch (error) {
    return { error: error.message };
  }
};



