import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgftd2zkl",
  api_key: "999152573841672",
  api_secret: "DHmeTZpLWGLph6AF248IHnad5Gs",
});

export const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};

export const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToDelete, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};
