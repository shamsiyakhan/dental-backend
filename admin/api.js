const app=require('../express.js')
const conn=require('../db.js')
const unique = require('../uniqueId.js')
const { generateToken } = require('.././jwt');


app.post("/add-admin" , (req, res)=>{
    const adminid=unique()
    const sql="insert into admin(admin_id , fullname , email , password ,phone) values (?,?,?,?,?)"
    conn.query(sql , [adminid , req.body.fullname , req.body.email , req.body.password  , req.body.phone] , (err ,result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:"Admin added successfully"})
        }
    })
})


app.post("/add-clerk" , (req, res)=>{
    const clerid=unique()
    const sql="insert into user(userid , email , password ,fullname , address , gender , marital_status , dob , role , phone , emergency_contact , emergency_name) values (?,?,?,?,? , ?,?,?,?,?,?,?    )"
    conn.query(sql , [clerid , req.body.email , req.body.password , req.body.fullname  , req.body.address ,  req.body.gender ,  req.body.marital_status , req.body.dob , 'Clerk' ,  req.body.phone ,req.body.emergency_contact  , req.body.emergency_name  ] , (err ,result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:"Clerk added successfully"})
        }
    })
})



app.post("/admin-login" , (req, res)=>{
    const adminid=unique()
    const sql="select * from admin where email=? and password=?"
    conn.query(sql , [req.body.email,req.body.password] , (err ,result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            if(result.length>0){  
                const token = generateToken(result[0].role, result[0].fullname);
                res.status(200).json({ message: 'Login successful', user: result[0], token: token })
            }else{
                res.status(401).send({error:"Invalid Username or password"})
            }
           
        }
    })
})


app.post("/add-department" , (req , res)=>{
    const deptid=unique()
    const sql="insert into department(dept_id , dept_name ,hodname , dept_username , dept_password) values(?,?,?,?,?)"
    conn.query(sql , [deptid ,req.body.name , req.body.hodname , req.body.username ,req.body.dept_password] , (err, result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:"Added Successfully"})
        }
    })

})




app.post("/add-charges" , (req , res)=>{
    const treatmentId=unique()
    const sql="insert into treatment_master(treatment_id , treatment_name, treatment_price ,type)values(?,?,?,?)"
    conn.query(sql , [treatmentId ,req.body.treatment_name , req.body.treatment_price , req.body.username ,req.body.dept_password] , (err, result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:"Added Successfully"})
        }
    })

})


app.post('/addTests', (req, res) => {

    const testid = unique()
    const sql="insert into treatment_master(treatment_id , treatment_name , treatment_price ,type , dept_id )values(?,?,?,?,?)"
    conn.query(sql,[testid, req.body.treatment_name , req.body.treatment_price , req.body.type ,  req.body.dept_id ],(err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Test Added Successfully' })
        }
    })

})

app.post('/addTreatment', (req, res) => {

    const testid = unique()
    const sql="insert into treatment_master(treatment_id , treatment_name , treatment_price ,type , dept_id )values(?,?,?,?,?)"
    conn.query(sql,[testid, req.body.treatment_name , req.body.treatment_price , req.body.type ,  req.body.dept_id ],(err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Treatment Added Successfully' })
        }
    })

})


app.get('/getTests/:id' ,(req ,res)=>{
    const sql="select * from treatment_master where dept_id=? and type='Test'"
    conn.query(sql ,[req.params.id],(err , result)=>{
        if(err){
            console.error(err)
            res.status(500).send({error:'Internal server error'})
        }else{
            res.status(200).send({result:result})
        }
    })
})


app.get('/getDepartments', (req ,res)=>{
    const sql="select * from department"
    conn.query(sql , (err , result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:result})
        }
    })
})