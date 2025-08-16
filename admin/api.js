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


app.get('/api/getDepartments', (req ,res)=>{
    const sql="select * from department"
    conn.query(sql , (err , result)=>{
        if(err){
            res.status(500).send({error:err})
        }else{
            res.status(200).send({result:result})
        }
    })
})

app.post('/api/addTreatmentAdmin', (req, res) => {
    console.warn('Received request to add treatment:', req.body);
    const {
        treatment_name,
        total_charges,
        dept_id,
        had_sub_category,
        subcategories
    } = req.body;

    // Function to generate a truly unique treatment_id
    const generateUniqueTreatmentId = (callback) => {
        const treatmentId = unique(); // assume this returns a string
        const checkSql = 'SELECT COUNT(*) AS count FROM treatment_chart WHERE treatment_id = ?';
        conn.query(checkSql, [treatmentId], (err, result) => {
            if (err) {
                console.error('Error checking treatment ID:', err);
                return res.status(500).json({ error: 'Internal error while checking treatment ID' });
            }

            if (result[0].count > 0) {
                generateUniqueTreatmentId(callback); // Try again if ID exists
            } else {
                callback(treatmentId); // Use unique ID
            }
        });
    };

    generateUniqueTreatmentId((treatmentId) => {
        const insertSql = `INSERT INTO treatment_chart 
            (treatment_id, treatment_name, total_charges, dept_id, had_sub_category) 
            VALUES (?, ?, ?, ?, ?)`;

        conn.query(insertSql, [treatmentId, treatment_name, total_charges, dept_id, had_sub_category], (err, result) => {
            if (err) {
                console.error('Failed to insert into treatment_chart:', err);
                return res.status(500).json({ error: 'Failed to add treatment' });
            }

            console.warn('Treatment added successfully:', result);

            // Check if subcategories are present
            if (!had_sub_category || !Array.isArray(subcategories) || subcategories.length === 0) {
                return res.status(200).json({ message: 'Treatment added successfully (no subcategories)' });
            }

            // Prepare subcategory values
            const subSql = `INSERT INTO treatment_subcategory 
                (sub_id, treatment_id, step_name, step_charges, step_sequence) 
                VALUES ?`;

            const subValues = subcategories.map(sub => [
                unique(),
                treatmentId,
                sub.step_name,
                sub.step_charges,
                sub.step_sequence
            ]);

            conn.query(subSql, [subValues], (subErr, subResult) => {
                if (subErr) {
                    console.error('Failed to insert subcategories:', subErr);
                    return res.status(500).json({ error: 'Treatment added but subcategories failed to insert' });
                }

                console.warn('Subcategories inserted:', subResult);
                return res.status(200).json({ message: 'Treatment and subcategories added successfully' });
            });
        });
    });
});

app.get("/api/getTreatment/:id", (req, res) => {
    const deptId = req.params.id;

    const query = `
        SELECT 
            t.treatment_id,
            t.treatment_name,
            t.total_charges,
            t.dept_id,
            ts.sub_id,
            ts.step_name,
            ts.step_sequence
        FROM treatment_chart t
        LEFT JOIN treatment_subcategory ts 
            ON t.treatment_id = ts.treatment_id
        WHERE t.dept_id = ?
        ORDER BY t.treatment_id, ts.step_sequence
    `;

    conn.query(query, [deptId], (err, results) => {
        if (err) {
            console.error('Error fetching treatments:', err);
            return res.status(500).json({ error: 'Error fetching treatments' });
        }

        const treatmentsMap = {};

        results.forEach(row => {
            if (!treatmentsMap[row.treatment_id]) {
                treatmentsMap[row.treatment_id] = {
                    treatment_id: row.treatment_id,
                    treatment_name: row.treatment_name,
                    total_charges: row.total_charges,
                    dept_id: row.dept_id,
                    subcategories: []
                };
            }

            if (row.sub_id) {
                treatmentsMap[row.treatment_id].subcategories.push({
                    sub_id: row.sub_id,
                    step_name: row.step_name,
                    step_sequence: row.step_sequence
                });
            }
        });

        const treatmentsArray = Object.values(treatmentsMap);

        return res.status(200).json({ treatments: treatmentsArray });
    });
});



app.get('/treatments/by-dept/:deptId', function (req, res) {
    const deptId = req.params.deptId;

    const getTreatmentsQuery = `SELECT * FROM treatment_chart WHERE dept_id = ?`;
    const getSubcategoriesQuery = `SELECT * FROM treatment_subcategory WHERE treatment_id IN (?)`;

    conn.query(getTreatmentsQuery, [deptId], function (err, treatments) {
        if (err) {
            console.error('Error fetching treatments:', err);
            return res.status(500).json({ error: 'Error fetching treatments' });
        }

        const treatmentIds = treatments.map(t => t.treatment_id);

        if (treatmentIds.length === 0) {
            return res.json([]);
        }

        conn.query(getSubcategoriesQuery, [treatmentIds], function (err, subcategories) {
            if (err) {
                console.error('Error fetching subcategories:', err);
                return res.status(500).json({ error: 'Error fetching subcategories' });
            }

            // Group subcategories by treatment_id
            const subcatMap = {};
            subcategories.forEach(sub => {
                if (!subcatMap[sub.treatment_id]) {
                    subcatMap[sub.treatment_id] = [];
                }
                subcatMap[sub.treatment_id].push({

                    step_name: sub.step_name,
                    step_charges: sub.step_charges,
                    step_sequence: sub.step_sequence
                });
            });

            // Attach subcategories to treatments
            const finalResult = treatments.map(treatment => ({
                treatment_id: treatment.treatment_id,
                treatment_name: treatment.treatment_name,
                total_charges: treatment.total_charges,
                had_sub_category: treatment.had_sub_category,
                dept_id: treatment.dept_id,
                subcategories: treatment.had_sub_category ? (subcatMap[treatment.treatment_id] || []) : []
            }));

            res.json(finalResult);
        });
    });
});