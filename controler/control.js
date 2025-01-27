import jwt from"jsonwebtoken";
import executeQuery  from "../constant/constant.js";
import dotenv from "dotenv";
dotenv.config();


async function register(req,res){
    
   const {name,email,password} = req.body
    try{
    if(name && email && password){  
    const response = await executeQuery(`INSERT INTO users (name,email,password) VALUES(?, ?, ?)`,[name,email,password]);
    console.log(response[0].affectedRows);
    response[0].affectedRows > 0 ? res.status(200).json("valid") : res.status(400).json(400);
    }
    }
    catch(err){
        console.log(err);
        
    res.status(400).send(err);
    console.log("email already exist");
    }   
    }
    
    async function login(req,res){
        console.log("in");
    const {email,password} = req.body;
    try{
    const userData = await executeQuery(`SELECT * FROM users WHERE email=? AND password=? AND is_active=1`,[email,password])
    if(userData[0].length  > 0){
    const user_name = userData[0];
    const token = jwt.sign({id:user_name[0].user_id,name:user_name[0].name,email:email},process.env.jwt_pass,{expiresIn:"168h"});
    
    res.status(200).json({"token":token,"status":200});
    }
    else{
    res.status(400).json(400);
    }
    }
    catch(err){
    console.log(err);
    
    res.status(400).json(400);
    } 
    }
    
    async function tokenValidation(req,res){    
    const authHeader = req.headers.authorization;
    
    try{
    if(authHeader){
        const decoded = jwt.verify(authHeader,process.env.jwt_pass);
        decoded ? res.status(200).json("valid") : res.status(400).json("invalid");
    }
    }
    catch(err){
        res.status(400).json(400);
    }
    }

    async function middlewarefumction(req,res,next){  
        const authHeader = req.headers.authorization;
        
        try{
        if(authHeader){
            const decoded = jwt.verify(authHeader,process.env.jwt_pass);
            console.log(decoded);
            req.user_id=decoded.id;
            
            
            decoded ? next() : res.status(400).json("invalid");
        }
        }
        catch(err){
            res.status(400).json(400);
        }
        }


 async function saveApplicant(req,res) {
const {id,name}=req.body;
const user_id = req.user_id;
console.log(req.body,req.user_id,"kl");
try{
const insertApplicant = await executeQuery(`INSERT INTO applicants(applicant_id,applicant_name,user_id) VALUES(?,?,?)`,[id,name,user_id]);
insertApplicant[0].affectedRows > 0 ? res.status(200).json("inserted") : res.status(400).json("Not inserted try again later");
}
catch(err){
    res.status(400).json("Not inserted try again later")
}

  }

async function  retriveData(req,res) {

const user_id = req.user_id;

try{
const data = await executeQuery(`SELECT a.applicant_id as id, a.applicant_name as name, d.doc_id, d.doc_name,d.file_name,d.file_size as size,d.status FROM applicants a left join documents d on a.applicant_id = d.applicant_id WHERE user_id=? && is_active=?`,[user_id,1])
console.log(data[0]);

data[0].length > 0 ? res.status(200).json(data[0]):res.status(200).json(400)

}
catch(err){
res.status(400).json("try again later")
}
}
async function deleteApplicant(req,res) {
    const applicant_id =req.body.id;
    const user_id = req.user_id;
    try{
const deleteData = await executeQuery(`UPDATE applicants SET is_active=? WHERE applicant_id=? AND user_id=?`,[0,applicant_id,user_id])
deleteData[0].affectedRows > 0 ? res.status(200).json("deleted"):res.status(400).json("error")
    }
    catch(err){
        res.status(400).json("error")

    }
    
}

async function insertDocument(req,res){
const user_id=req.user_id
const {docs,id} =req.body;
try{

const savDocs =await executeQuery(`INSERT INTO documents(doc_id,doc_name,applicant_id) VALUES(?,?,?)`,[docs.doc_id,docs.doc_name,id])

savDocs[0].affectedRows > 0 ? res.status(200).json("inserted"):res.status(400).json("not inserted")
}
catch(err){
res.status(400).json("not inserted")
}

}

async function fileDelete(req,res) {
  const doc_id = req.body.doc_id;
  try{
const file_delete = await executeQuery(`UPDATE documents SET document=?,file_name=?,file_size=?,status=? WHERE
  doc_id=?`,[null,null,null,'pending',doc_id])
  file_delete[0].affectedRows > 0 ? res.status(200).json("document saved"):res.status(400).json("failed");
  }
  catch(err){
    console.log(err);
    
    res.status(400).json("failed");
  }
  
}

  
    



export default{register,tokenValidation,login,saveApplicant,middlewarefumction,retriveData,deleteApplicant,insertDocument,fileDelete}