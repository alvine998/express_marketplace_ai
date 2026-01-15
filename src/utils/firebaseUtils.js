const { bucket } = require("../config/firebase");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadImageToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file provided");
    }

    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject(`Something is wrong! Unable to upload at the moment. ${error}`);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

const deleteImageFromFirebase = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract filename from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    if (fileName) {
      const file = bucket.file(fileName);
      await file.delete();
      console.log(`Deleted file: ${fileName}`);
    }
  } catch (error) {
    console.error("Error deleting file from Firebase:", error);
    throw error;
  }
};

module.exports = { uploadImageToFirebase, deleteImageFromFirebase };
