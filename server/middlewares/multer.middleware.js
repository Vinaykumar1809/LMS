import path from 'path';

import multer from 'multer';

const upload = multer({
    dest:"uploads/",
    limits: {fileSize: 300*1024*1024}, //300 mb in size max limit
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (req,file,cb)=>{
            cb(null,file.originalname);
        },
    }),
    fileFilter: (_req,file,cb)=>{
        let ext = path.extname(file.originalname);

        if(
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png"  &&
            ext  !==".mp4"   &&
            ext  !== ".avif" &&
            ext  !== ".pdf"
        ){
            cb(new Error (`Unsupported file type!' ${ext}`),false);
            return;
        }

        cb(null,true);
    },
});

export default upload;
