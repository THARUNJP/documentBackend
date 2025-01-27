import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Destination - Received Body:', req.body);
        console.log('Destination - Received File:', file);
        
        const doc_id = req.body.doc_id || 'default';
        const dir = path.join('C:/output-files', doc_id);
        
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        console.log('Filename - Received Body:', req.body);
        console.log('Filename - Received File:', file);
        
        const doc_id = req.body.doc_id || 'default';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${doc_id}_${uniqueSuffix}_${file.originalname}`);
    }
});

const upload = multer({ storage });

export default upload;