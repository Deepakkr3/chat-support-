import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ticketId = req.params.ticketId
    const uploadPath = path.join(__dirname, `../../uploads/${ticketId}`);

   
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ticketId = req.params.ticketId
    const fileExtnion = path.extname(file.originalname); 
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = path.extname(file.originalname); // Get file extension
    // const fileName = `${path.basename(file.originalname, fileExt)}-${ticketId}${fileExt}`; 
    // Unique name with timestamp and random number
    const timestamp = Date.now(); 




    const fileName = `${timestamp}-${ticketId}${fileExt}`;

    cb(null, fileName);
  }
});

const upload = multer({ storage: storage ,
  limits: {
    fileSize: 1024 * 1024 * 1 
  }
});

export default upload;
