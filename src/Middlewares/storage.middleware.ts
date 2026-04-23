import multer from "multer";

const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file &&
      (file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

export { uploadImage };