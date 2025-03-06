const cloudinary = require("cloudinary").v2;

const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'draezw4ed',
  api_key: '111157882142936',
  api_secret: 'IHHjYTk9TSAhCES60FFYkwSRVyE',
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log('No file path provided.');
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Automatically detect file type (video, image, etc.)
    });

    console.log('File is uploaded on Cloudinary:', response.url);

    // After successful upload, remove the local file
    fs.unlinkSync(localFilePath); // This will work only if localFilePath exists

    return response; // Return Cloudinary response with URL
  } catch (error) {
    // If uploading fails, ensure the local file is deleted
    if (localFilePath) {
      try {
        fs.unlinkSync(localFilePath); // Remove file if upload fails
        console.log('Local file deleted due to upload failure.');
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

module.exports= { uploadOnCloudinary };