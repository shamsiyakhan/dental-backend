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

app.get("/api/getDoctorDetail/:docId" , (req , res)=>{
    const docId=req.params.docId
    const sql="SELECT doctor_id, fullname, email, phone_no FROM doctor WHERE doctor_id = ?"
    conn.query(sql , [docId] , (err , result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:result})
        }
    })
})

app.post("/api/OnboardingComplete" , (req , res)=>{
    const {doctor_id , password , experience , degree , phone_no , address , marital_status , gender , dob , qualification , specialization , biography}=req.body
    const sql="UPDATE doctor SET onboarding_status = 1 , password=? , experience=? , degree=? , phone_no=? , address=? ,marital_status=? , gender=? , dob=? , qualification=? , specialization=? , biography=? WHERE doctor_id = ?"
    conn.query(sql , [password , experience , degree , phone_no , address , marital_status , gender , dob , qualification , specialization , biography , doctor_id] , (err , result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({message:"Onboarding Completed"})
        }
    })
})


app.get("/api/getAppointmentsOfDoctor/:docId", (req, res) => {
    const sql = `
        SELECT a.*, t.* 
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        WHERE a.doctor_id=? 
          AND DATE(a.appointment_date)=? 
          AND a.status='Scheduled'
    `;

    const today = new Date().toISOString().slice(0, 10);

    conn.query(sql, [req.params.docId, today], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: err });
        } else {
            res.status(200).send({ result });
        }
    });
});

