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
        SELECT a.*, t.*,p.fullname , p.email , p.phone , d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user p ON t.patientid = p.userid
        Left join doctor d on a.doctor_id=d.doctor_id
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


app.get("/api/getSpecificAppointments/:app_id", (req, res) => {
    const sql = `
        SELECT a.*, t.*,p.fullname , p.email , p.phone , d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user p ON t.patientid = p.userid
        Left join doctor d on a.doctor_id=d.doctor_id
        WHERE a.appointment_id=? 
    `;

    conn.query(sql, [req.params.app_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: err });
        } else {
            res.status(200).send({ result });
        }
    });
});

app.post("/api/markAppointmentComplete" , (req , res)=>{
    const {appointment_id , treatment_notes , prescription , findings , treatment_id}=req.body
    const sql="UPDATE appointment SET status='Completed' , treatment_notes=? , prescription=? , finding=? WHERE appointment_id=?"
    conn.query(sql , [treatment_notes , prescription , findings , appointment_id] , (err , result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            /* res.status(200).send({message:"Appointment marked as completed"}) */
            const updateTreatmentSql="UPDATE treatment_details SET status='Completed' WHERE treatment_id=?"
            conn.query(updateTreatmentSql , [treatment_id] , (err2 , result2)=>{
                if(err2){
                    res.status(500).send({error:err2})
                }else{
                    res.status(200).send({message:"Appointment marked as completed and treatment status updated"})
                }
            })
        }
    })
});

app.get("/api/getAppointmentsOfDoctorSpecificDates/:docId/:date", (req, res) => {
    const sql = `
        SELECT a.*, t.*,p.fullname , p.email , p.phone , d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user p ON t.patientid = p.userid
        Left join doctor d on a.doctor_id=d.doctor_id
        WHERE a.doctor_id=? 
          AND DATE(a.appointment_date)=? 
          AND a.status='Scheduled'
    `;

   const today = new Date().toISOString().slice(0, 10);

    conn.query(sql, [req.params.docId, req.params.date], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: err });
        } else {
            res.status(200).send({ result });
        }
    });
});


app.get("/api/getCompletedAppointments/:docId", (req, res) => {
    const sql = `
        SELECT a.*, t.*,p.fullname , p.email , p.phone , d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user p ON t.patientid = p.userid
        Left join doctor d on a.doctor_id=d.doctor_id
        WHERE a.doctor_id=? 
          AND a.status='completed'
    `;

   const today = new Date().toISOString().slice(0, 10);

    conn.query(sql, [req.params.docId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: err });
        } else {
            res.status(200).send({ result });
        }
    });
});



// GET Doctor by ID
app.get('/api/doctor/:doctor_id', (req, res) => {
  const { doctor_id } = req.params;

  const sql = "SELECT * FROM doctor WHERE doctor_id = ?";
  conn.query(sql, [doctor_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Doctor not found" });

    res.json({ doctor: result[0] });
  });
});

// UPDATE Doctor by ID
app.put('/api/doctor/:doctor_id', (req, res) => {
  const { doctor_id } = req.params;
  const {
    fullname, email, experience, degree, phone_no,
    address, marital_status, gender, dob, qualification,
    specialization, biography, onboarding_status
  } = req.body;

  const sql = `
    UPDATE doctor SET 
      fullname=?, email=?, experience=?, degree=?, phone_no=?,
      address=?, marital_status=?, gender=?, dob=?, qualification=?,
      specialization=?, biography=?, onboarding_status=?
    WHERE doctor_id=?
  `;

  const values = [
    fullname, email, experience, degree, phone_no,
    address, marital_status, gender, dob, qualification,
    specialization, biography, onboarding_status, doctor_id
  ];

  conn.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor updated successfully" });
  });
});

