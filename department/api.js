const app=require('../express.js')
const conn=require('../db.js')
const unique = require('../uniqueId.js')


app.get('/getDoctors/:id' , (req , res)=>{
    const sql="select * from doctor where dept_id=?"
    conn.query(sql , [req.params.id] , (err , result)=>{
        if(err){
            console.error(err)
            res.status(500).json({error:'Internal server error'})
        }else{
            res.status(200).json(result)
        }
    })  

})

app.post('/chiefRegister', (req, res) => {

    const complaintId = unique()
    const date=new Date()
    const sql="insert into cheif_complaint(complaint_id , patientid , reporting_date ,issue_reported , tests , total_charge , payment_status)values(?,?,?,?,?,? , ?)"
    conn.query(sql,[complaintId, req.body.patientid , date , req.body.issue_reported , JSON.stringify(req.body.tests) , req.body.total_charge , req.body.payment_status],(err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Chief complaint registered successfully' })
        }
    })

})


app.get('/getPatients' ,(req ,res)=>{
    const sql="select * from user"
    conn.query(sql , (err , result)=>{
        if(err){
            console.error(err)
            res.status(500).json({error:'Internal server error'})
        }else{
            res.status(200).json(result)
        }
    })
})


app.get('/getPatientTreatments/:id' ,(req ,res)=>{
    const sql="select * from treatment_details where patientid=?"
    conn.query(sql ,[req.params.id], (err , result)=>{
        if(err){
            console.error(err)
            res.status(500).json({error:'Internal server error'})
        }else{
            if(result.length>0){
                res.status(200).json({result:result})
            }else{
                res.status(200).json({result:"No data found"})
            }
            
        }
    })
})


app.get('/getPatientChiefComplaint/:id' ,(req ,res)=>{
    const id=req.params.id
    const sql="select * from cheif_complaint where patientid=?"
    conn.query(sql ,[req.params.id], (err , result)=>{
        if(err){
            console.error(err)
            res.status(500).json({error:'Internal server error'})
        }else{
            if(result.length>0){
                res.status(200).json({result:result})
            }else{
                res.status(200).json({result:"No data found"})
            }
            
        }
    })
})


app.get('/getPatient/:id' ,(req ,res)=>{
    const sql="select * from user where userid=?"
    conn.query(sql ,[req.params.id],(err , result)=>{
        if(err){
            console.error(err)
            res.status(500).json({error:'Internal server error'})
        }else{
            res.status(200).json(result)
        }
    })
})