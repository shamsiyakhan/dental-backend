const app=require('../express.js')
const conn=require('../db.js')
const unique = require('../uniqueId.js')


app.get('/departments', (req , res)=>{
    const sql="select dept_id , dept_name , hodname , dept_username from department"
    conn.query(sql , (err , result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:result})
        }
    })
})