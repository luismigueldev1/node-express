const path = require("path");
const { v4: uuidv4 } = require("uuid");

const upload = (
  files,
  extensions = ["jpg", "jpeg", "png", "gif", "webp"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    const splitFileName = file.name.split(".");
    const fileExtension = splitFileName[splitFileName.length - 1];

    // Check file extension
    const validExtension = extensions;
    if (!validExtension.includes(fileExtension)) {
      return reject(
        `Invalid file extension. Please upload a valid image file like: ${validExtension.join(
          " , "
        )} `
      );
    }

    const fileName = `${uuidv4()}.${fileExtension}`;
    const uploadPath = path.join(__dirname, "../uploads/", folder, fileName);

    file.mv(uploadPath, (error) => {
      if (error) return reject(`Error while uploading file: ${error.message}`);

      return resolve(fileName);
    });
  });
};

module.exports = {
  upload,
};
