const app=require('../express.js')
const conn=require('../db.js')
const unique = require('../uniqueId.js')

app.get("/api/getChiefComplaint/:id" , (req , res)=>{
    const sql="select * from cheif_complaint where patientid=?"
    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ chiefComplaint: result })
        }
    })
})

app.get("/api/getTreatmentHistory/:id" , (req , res)=>{
    const sql="select * from treatment_details where complaint_id=?"
    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ treatmentHistory: result })
        }
    })
})



function structureTreatmentData(rows) {
    if (!rows || rows.length === 0) {
        return null; // Handle case where no treatment is found
    }

    // 1. Initialize the main treatment object from the first row
    const firstRow = rows[0];
    const treatment = {
        treatment_id: firstRow.treatment_id,
        treatment_name: firstRow.treatment_name,
        issue_date: firstRow.issue_date,
        status: firstRow.status,
        total_charges: firstRow.total_charges,
        finding: firstRow.finding,
        history: firstRow.history,
        dept_id: firstRow.dept_id,
        patientid: firstRow.patientid,
        doctorid: firstRow.doctorid,
        complaint_id: firstRow.complaint_id,
        payment_status: firstRow.payment_status,
        prescriptions: []
    };

    // Use a Map to track unique prescriptions and avoid duplicates
    const prescriptionMap = new Map();

    // 2. Iterate over the results to group prescriptions and details
    for (const row of rows) {
        const pId = row.prescription_id;
        
        // Skip rows where no prescription or medication exists for the treatment (due to LEFT JOIN)
        if (!pId) {
            continue; 
        }

        // --- Handle Prescription Header ---
        let prescription = prescriptionMap.get(pId);
        if (!prescription) {
            prescription = {
                prescription_id: pId,
                prescription_date: row.prescription_date,
                doctor_notes: row.doctor_notes,
                medications: []
            };
            prescriptionMap.set(pId, prescription);
        }

        // --- Handle Medication Details (Line Item) ---
        // Only add medication if it exists (for cases where a prescription exists but has no items, though unlikely)
        if (row.medication_name) {
            prescription.medications.push({
                medication_name: row.medication_name,
                dosage: row.dosage,
                quantity: row.quantity,
                frequency: row.frequency,
                duration: row.duration,
                instructions: row.instructions,
            });
        }
    }

    // 3. Convert the Map values into the final prescriptions array
    treatment.prescriptions = Array.from(prescriptionMap.values());

    return treatment;
}


// ===============================================
// 3. API ROUTE DEFINITION
// ===============================================

// ===============================================
// 3. API ROUTE DEFINITION (Standard mysql/mysql2 callback)
// ===============================================

app.get("/api/getSpecificTreatment/:treatment_id", async (req, res) => {
    const { treatment_id } = req.params;

    // This SQL query remains the same and is correct for fetching all data
    const sqlQuery = `
        SELECT
            td.*, 
            p.prescription_id,
            p.prescription_date,
            p.doctor_notes,
            pd.medication_name,
            pd.dosage,
            pd.quantity,
            pd.frequency,
            pd.duration,
            pd.instructions
        FROM
            dental.treatment_details td
        LEFT JOIN 
            dental.prescription p ON td.treatment_id = p.treatment_id
        LEFT JOIN 
            dental.prescription_details pd ON p.prescription_id = pd.prescription_id
        WHERE
            td.treatment_id = ?;
    `;

    try {
        // --- 🔑 Key Fix: Wrapping the callback in a Promise ---
        const rows = await new Promise((resolve, reject) => {
            // Use conn.query with the standard callback: (error, results)
            conn.query(sqlQuery, [treatment_id], (error, results) => {
                if (error) {
                    return reject(error); // Database error
                }
                // 'results' (the rows array) is passed to resolve
                resolve(results); 
            });
        });
        // --- End of Key Fix ---

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "Treatment not found." });
        }

        // Structure the flat results into the nested JSON format
        // The structureTreatmentData function you provided is perfectly fine here.
        const structuredData = structureTreatmentData(rows);
        
        // Send the final result
        res.status(200).json(structuredData);

    } catch (error) {
        // This catch handles database errors and any other internal API errors.
        console.error("Database or API error:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});


app.get('/patient/:userid', (req, res) => {
  const { userid } = req.params;
  const query = `SELECT * FROM user WHERE userid = ?`;

  conn.query(query, [userid], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(result[0]);
  });
});


app.put('/patient/:userid', (req, res) => {
  const { userid } = req.params;

  const {
    email,
    password,
    fullname,
    address,
    gender,
    marital_status,
    dob,
    role,
    phone,
    emergency_contact,
    emergency_name
  } = req.body;

  const query = `
    UPDATE user 
    SET  password = ?, fullname = ?, address = ?, gender = ?, marital_status = ?, dob = ?, 
        role = ?, phone = ?, emergency_contact = ?, emergency_name = ?
    WHERE userid = ?
  `;

  conn.query(
    query,
    [
      password, fullname, address, gender, marital_status, dob,
      role, phone, emergency_contact, emergency_name, 
      userid
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.status(200).json({ message: "Patient updated successfully" });
    }
  );
});


app.get("/api/getUpcomingAppointments/:patientid", (req, res) => {
    const sql = `
        SELECT a.*, t.*,d.fullname as doctor_name , d.degree , d.specialization , dept.dept_name
        FROM appointments a
        JOIN treatment_details t ON a.treatment_id = t.treatment_id
        JOIN doctors d ON t.doctor_id = d.doctor_id
        JOIN departments dept ON d.dept_id = dept.dept_id
        WHERE treatment_details.patient_id = ? AND a.date >= NOW()
        ORDER BY a.date ASC
    `;
    const { patientid } = req.params;
    conn.query(sql, [patientid], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
});