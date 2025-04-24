const mysql=require('mysql')

const conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"dental"
})

conn.connect((err)=>{
    if(err){
        console.error("Database connection failed" , err)
    }else{
        console.warn("Database Connected Sucessfully")
    }
})

module.exports=conn



/* SET SQL_SAFE_UPDATES = 1; */