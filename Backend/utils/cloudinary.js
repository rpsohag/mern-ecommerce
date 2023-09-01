import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgftd2zkl",
  api_key: "999152573841672",
  api_secret: "DHmeTZpLWGLph6AF248IHnad5Gs",
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
        });
      }
    });
  });
};

export default cloudinaryUploadImg;
