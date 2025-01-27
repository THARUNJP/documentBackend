import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


const DB = mysql.createPool({
host: 'junction.proxy.rlwy.net', 
user: 'root',                    
password: 'cbafpqGFZYSLtaLDDSSuuBfxbumoVUpM', 
database: 'railway',             
port: 47681 ,      
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0,
});

async function executeQuery(query, params) {
    const db = await DB.getConnection();
    try {
        const response = await db.query(query, params);
        return response;
    } 
    catch(err){
        console.log(err);
        
    }
        finally {
        db.release();
    }
}

export default executeQuery;