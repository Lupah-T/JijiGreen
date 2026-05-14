import { upload } from "../config/multer.js";

export const uploadWasteImage = upload.single("image");
