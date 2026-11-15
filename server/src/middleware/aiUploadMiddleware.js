import multer from "multer";

const allowedTypes = ["image/jpeg", "image/png"];

export const uploadAiImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Only JPG and PNG images are supported."));
    }
    callback(null, true);
  },
}).single("image");
