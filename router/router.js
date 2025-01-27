import express from "express";
const rout = express.Router();
import app from "../controler/control.js"
import executeQuery from "../constant/constant.js";
import upload from "../constant/multer.js";




rout.post('/register',app.register);
rout.post('/login',app.login);
rout.get('/tokenValidation',app.tokenValidation);
rout.post('/saveApplicant',app.middlewarefumction,app.saveApplicant);
rout.get('/retrive',app.middlewarefumction,app.retriveData);
rout.delete('/delete',app.middlewarefumction,app.deleteApplicant);
rout.post('/saveDocument',app.middlewarefumction,app.insertDocument);
rout.patch('/fileInsert', upload.single('file'), async(req, res) => {
if (!req.file) {
res.status(400).json({ message: 'No file uploaded' });
}else{
const fileName = req.file.originalname;const fileSize=req.file.size;const fileUrl =req.file.path;const doc_id=req.query.doc_id;
try {    
const query = `UPDATE documents SET file_name=?, file_size=?, document=?, status=? WHERE doc_id=?`;
const response = await executeQuery(query, [fileName, fileSize, fileUrl,'completed', doc_id]);

if (response[0].affectedRows > 0) {
res.status(200).json("document saved");
} else {
res.status(400).json("failed");
}
} catch (err) {
    console.log(err);
    
res.status(400).json({ message: 'Database insertion failed', error: err });
}
}


});
rout.delete('/deleteFile',app.fileDelete)





export default rout;