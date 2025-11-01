const app = require('../express.js')
const conn = require('../db.js')
const unique = require('../uniqueId.js')
const sendEmail = require('../mail.js')

app.get('/getDoctors/:id', (req, res) => {
    const sql = "SELECT * FROM doctor WHERE dept_id = ?";
    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Wrap each department query in a Promise
        const promises = result.map(doc => {
            return new Promise((resolve, reject) => {
                const docSql = "SELECT dept_id, dept_name, hodname, dept_username FROM department WHERE dept_id = ?";
                conn.query(docSql, [doc.dept_id], (err, deptResult) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        doctor: doc,
                        department: deptResult[0] || {}
                    });
                });
            });
        });

        Promise.all(promises)
            .then(docResult => {
                res.status(200).json({ data: docResult });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Internal server error in department lookup' });
            });
    });
});


app.post('/chiefRegister', (req, res) => {
    const complaintId = unique();
// Force IST date as string
const now = new Date();
const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes
const istTime = new Date(now.getTime() + istOffset);

// Format YYYY-MM-DD (string only, not Date object)
const date = istTime.toISOString().slice(0, 10);



    // Insert chief complaint information into the chief_complaint table
    const sql = "insert into cheif_complaint(complaint_id, patientid, reporting_date, issue_reported, tests, total_charge, payment_status, payment_mode) values(?, ?, ?, ?, ?, ?, ?, ?)";
    conn.query(sql, [
        complaintId,
        req.body.patientid,
        date,
        req.body.issue_reported,
        JSON.stringify(req.body.tests),
        req.body.total_charge,
        "Paid",
        req.body.payment_mode
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If there are tests, we need to insert them into the "test" table
        if (req.body.tests && req.body.tests.length > 0) {
            // Loop through the tests array
            const testPromises = req.body.tests.map((testId) => {
                return new Promise((resolve, reject) => {
                    // Fetch test information from the treatment_master table
                    const treatmentSql = "SELECT treatment_id, treatment_name, treatment_price FROM treatment_master WHERE treatment_id = ?";
                    conn.query(treatmentSql, [testId], (err, treatmentResult) => {
                        if (err) {
                            return reject(err);
                        }

                        if (treatmentResult.length > 0) {
                            const treatment = treatmentResult[0];

                            // Insert each test into the "test" table
                            const insertTestSql = "INSERT INTO test (test_name, test_price, test_date, userid, referred_dept, complain_id, report_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
                            const testValues = [
                                treatment.treatment_name,
                                treatment.treatment_price,
                                date,
                                req.body.patientid,
                                req.body.referred_dept,
                                complaintId,
                                "In process" // report_status is "In process"
                            ];

                            conn.query(insertTestSql, testValues, (err) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve();
                            });
                        } else {
                            reject(new Error(`Treatment with ID ${testId} not found in treatment_master`));
                        }
                    });
                });
            });

            // Wait for all test insertions to complete
            Promise.all(testPromises)
                .then(() => {
                    res.status(200).json({ message: 'Chief complaint registered successfully' });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Error processing tests' });
                });
        } else {
            // If no tests, directly send success response
            res.status(200).json({ message: 'Chief complaint registered successfully' });
        }
    });
});




app.get('/getPatients', (req, res) => {
    const sql = "select * from user where role='patient'"
    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json(result)
        }
    })
})


app.get('/getPatientTreatments/:id', (req, res) => {
    const sql = "select * from treatment_details where patientid=?"
    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            if (result.length > 0) {
                /*  res.status(200).json({ result: result }) */

                if (result.length > 0) {
                    const promises = result.map(doc => {
                        return new Promise((resolve, reject) => {
                            const docSql = "SELECT dept_id, dept_name, hodname, dept_username FROM department WHERE dept_id = ?";
                            conn.query(docSql, [doc.dept_id], (err, deptResult) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve({
                                    doctor: doc,
                                    department: deptResult[0] || {}
                                });
                            });
                        });
                    });

                    Promise.all(promises)
                        .then(docResult => {
                            res.status(200).json({ data: docResult });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({ error: 'Internal server error in department lookup' });
                        });
                }
            } else {
                res.status(200).json({ result: "No data found" })
            }

        }
    })
})


app.get('/getPatientChiefComplaint/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT 
            c.*, 
            u.userid, 
            u.fullname, 
            u.email, 
            u.phone
        FROM cheif_complaint c
        JOIN user u ON c.patientid = u.userid
        WHERE c.patientid = ? AND c.status IS NULL
    `;

    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            if (result.length > 0) {
                res.status(200).json({ result });
            } else {
                res.status(200).json({ result: "No data found" });
            }
        }
    });
});


app.get('/getPatient/:id', (req, res) => {
    const sql = "select * from user where userid=?"
    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json(result)
        }
    })
})






app.post('/startTreatment', (req, res) => {
    const treatmentId = unique()
    const date = new Date()
    const updateSql = "update cheif_complaint set status='Treatment Assigned' , treatment_assigned_at=? where complaint_id=?"
    conn.query(updateSql, [date, req.body.complaint_id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            const sql = "insert into treatment_details(treatment_id , treatment_name , issue_date ,status , total_charges , finding, history  ,dept_id , patientid , complaint_id , payment_status)values(?,?,?,?,?,?,?,?,?,?,?)"
            conn.query(sql, [treatmentId, req.body.treatment_name, req.body.issue_date, req.body.status, req.body.total_charge, req.body.finding, req.body.history, req.body.dept_id, req.body.patient_id, req.body.complaint_id, req.body.payment_status], (err, result) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({ error: 'Internal server error' })
                } else {
                    res.status(200).json({ message: 'Treatment Assigned Successfully' })
                }
            })
        }
    })

})


app.post('/addAppointment', (req, res) => {

    const testid = unique()
    const sql = "insert into appointment(appointment_id , treatment_id , appointment_date  , dept_id , status , payment_status)values(?,?,?,?,?,?)"
    conn.query(sql, [testid, req.body.treatment_id, req.body.appointment_date, req.body.dept_id, req.body.status, req.body.payment_status], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Appointment Created Successfully' })
        }
    })
})

app.post('/updateAppointment', (req, res) => {
    const sql = "update appointment set  payment_status=? where appointment_id=?"
    conn.query(sql, ["paid", req.body.appointment_id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Appointment Updated Successfully' })
        }
    })
})


app.post('/completeAppointment', (req, res) => {
    const sql = "update appointment set  status='completed' where appointment_id=?"
    conn.query(sql, [req.body.appointment_id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            /*  res.status(200).json({ message: 'Appointment Updated Successfully' }) */
            const sql = "update treatment_details set  status='completed' where treatment_id=?"
            conn.query(sql, [req.body.treatment_id], (err, result) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({ error: 'Internal server error' })
                } else {

                }
            })
        }
    })
})

app.post('/updateComplete', (req, res) => {
    // 1. Update treatment_details (finding, history)
    const sql = "UPDATE treatment_details SET finding=?, history=?, status='completed' WHERE treatment_id=?";
    conn.query(sql, [req.body.finding, req.body.history, req.body.treatment_id], (err, result) => {
        if (err) {
            console.error("Error updating treatment_details:", err);
            return res.status(500).json({ error: 'Internal server error during treatment update' });
        }
        
        console.warn("Updating appointment status to 'completed'");
        
        // 2. Update appointment status
        const sql1 = "UPDATE appointment SET status='completed' WHERE treatment_id=?";
        conn.query(sql1, [req.body.treatment_id], (err, result) => {
            if (err) {
                console.error("Error updating appointment status:", err);
                return res.status(500).json({ error: 'Internal server error during appointment update' });
            }
        
            
            
            // --- 🔑 START NEW LOGIC: PRESCRIPTION HEADER ---
            
            // 3. Insert into dental.prescription (Header)
            const prescriptionId = unique();
            const sql2 = "INSERT INTO dental.prescription (prescription_id, treatment_id, prescription_date, doctor_notes , appointment_id) VALUES (?, ?, ?, ? , ?)";
            const prescriptionValues = [
                prescriptionId, 
                req.body.treatment_id, 
                req.body.prescription_date, 
                req.body.doctor_notes,
                req.body.appointment_id
            ];
            
            conn.query(sql2, prescriptionValues, (err, result) => {
                if (err) {
                    console.error("Error inserting prescription header:", err);
                    return res.status(500).json({ error: 'Internal server error during prescription header insert' });
                }
                
                // --- 🔑 START NEW LOGIC: PRESCRIPTION DETAILS ARRAY ---
                
                const medications = req.body.medications || []; // Use an empty array if none provided
                const prescriptionID = prescriptionId; // The new FK for details table

                if (medications.length === 0) {
                    // No medications to insert, success is achieved at this point
                    return res.status(200).json({ message: 'Treatment and Prescription completed successfully (no medications provided)' });
                }

                // Function to handle sequential/iterative insert for the medication array
                const insertMedication = (index) => {
                    if (index >= medications.length) {
                        // 4b. ALL inserts are complete. Send final success response.
                        return res.status(200).json({ message: 'Treatment, Appointment, and Prescription completed successfully' });
                    }

                    const med = medications[index];
                    const sql3 = "INSERT INTO dental.prescription_details (prescription_id, medication_name, dosage, quantity, frequency, duration, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    
                    const detailValues = [
                        prescriptionID,
                        med.medication_name,
                        med.dosage,
                        med.quantity,
                        med.frequency,
                        med.duration,
                        med.instructions
                    ];

                    conn.query(sql3, detailValues, (err, result) => {
                        if (err) {
                            console.error(`Error inserting prescription detail index ${index}:`, err);
                            // Send error immediately upon first failure
                            return res.status(500).json({ error: `Internal server error inserting medication at index ${index}` });
                        }

                        // Recursively call for the next item
                        insertMedication(index + 1);
                    });
                };

                // 4a. Start the sequential insertion process
                insertMedication(0);
                
                // --- END NEW LOGIC: PRESCRIPTION DETAILS ARRAY ---
            });
        
            // --- END NEW LOGIC: PRESCRIPTION HEADER ---
        });
    });
});


app.post('/updateInComplete', (req, res) => {
    // 1. Update treatment_details (finding, history)
    const sql = "UPDATE treatment_details SET finding=?, history=?, status='completed' WHERE treatment_id=?";
    conn.query(sql, [req.body.finding, req.body.history, req.body.treatment_id], (err, result) => {
        if (err) {
            console.error("Error updating treatment_details:", err);
            return res.status(500).json({ error: 'Internal server error during treatment update' });
        }
        
        console.warn("Updating appointment status to 'completed'");
        
        // 2. Update appointment status
        const sql1 = "UPDATE appointment SET status='completed' WHERE treatment_id=?";
        conn.query(sql1, [req.body.treatment_id], (err, result) => {
            if (err) {
                console.error("Error updating appointment status:", err);
                return res.status(500).json({ error: 'Internal server error during appointment update' });
            }
            
            const appointmentId = unique();
            const sql3="insert into appointment(appointment_id , treatment_id , appointment_date  , dept_id , status  , doctor_id)values(?,?,?,?,?,?)"
            conn.query(sql3, [appointmentId, req.body.treatment_id, req.body.next_appointment_date, req.body.dept_id, "Scheduled", req.body.doctor_id], (err, result) => {
                if (err) {
                    console.error("Error inserting appointment:", err);
                    return res.status(500).json({ error: 'Internal server error during appointment insert' });
                }
            

            // --- 🔑 START NEW LOGIC: PRESCRIPTION HEADER ---
            
            // 3. Insert into dental.prescription (Header)
            const prescriptionId = unique();
            const sql2 = "INSERT INTO dental.prescription (prescription_id, treatment_id, prescription_date, doctor_notes , appointment_id) VALUES (?, ?, ?, ? , ?)";
            const prescriptionValues = [
                prescriptionId, 
                req.body.treatment_id, 
                req.body.prescription_date, 
                req.body.doctor_notes,
                req.body.appointment_id
            ];
            
            conn.query(sql2, prescriptionValues, (err, result) => {
                if (err) {
                    console.error("Error inserting prescription header:", err);
                    return res.status(500).json({ error: 'Internal server error during prescription header insert' });
                }
                
                // --- 🔑 START NEW LOGIC: PRESCRIPTION DETAILS ARRAY ---
                
                const medications = req.body.medications || []; // Use an empty array if none provided
                const prescriptionID = prescriptionId; // The new FK for details table

                if (medications.length === 0) {
                    // No medications to insert, success is achieved at this point
                    return res.status(200).json({ message: 'Treatment and Prescription completed successfully (no medications provided)' });
                }

                // Function to handle sequential/iterative insert for the medication array
                const insertMedication = (index) => {
                    if (index >= medications.length) {
                        // 4b. ALL inserts are complete. Send final success response.
                        return res.status(200).json({ message: 'Treatment, Appointment, and Prescription completed successfully' });
                    }

                    const med = medications[index];
                    const sql3 = "INSERT INTO dental.prescription_details (prescription_id, medication_name, dosage, quantity, frequency, duration, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    
                    const detailValues = [
                        prescriptionID,
                        med.medication_name,
                        med.dosage,
                        med.quantity,
                        med.frequency,
                        med.duration,
                        med.instructions
                    ];

                    conn.query(sql3, detailValues, (err, result) => {
                        if (err) {
                            console.error(`Error inserting prescription detail index ${index}:`, err);
                            // Send error immediately upon first failure
                            return res.status(500).json({ error: `Internal server error inserting medication at index ${index}` });
                        }

                        // Recursively call for the next item
                        insertMedication(index + 1);
                    });
                };

                // 4a. Start the sequential insertion process
                insertMedication(0);
                
                // --- END NEW LOGIC: PRESCRIPTION DETAILS ARRAY ---
            });
            });
        
            // --- END NEW LOGIC: PRESCRIPTION HEADER ---
        });
    });
});
app.get('/getAppointments/:id', (req, res) => {
    const sql = `
        SELECT 
            a.appointment_id,
            a.treatment_id,
            a.appointment_date,
            a.dept_id,
            a.status AS appointment_status,

            -- Treatment Details
            t.treatment_name,
            t.issue_date,
            t.status AS treatment_status,
            t.total_charges,
            t.finding,
            t.history,

            -- Department Details
            d.dept_name,
            d.hodname,
            d.dept_username,

            -- Patient Details
            u.userid AS patient_id,
            u.fullname AS patient_name,
            u.email AS patient_email,
            u.role AS patient_role

        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN department d ON a.dept_id = d.dept_id
        LEFT JOIN user u ON t.patientid = u.userid

        WHERE a.dept_id = ?
    `;

    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ result });
        }
    });
});


app.get('/getTodayAppointment/:id/:user_id', (req, res) => {
    const sql = `
        SELECT 
            a.appointment_id,
            a.treatment_id,
            a.appointment_date,
            a.dept_id,
            a.status AS appointment_status,

            -- Treatment Details
            t.treatment_name,
            t.issue_date,
            t.status AS treatment_status,
            t.total_charges,
            t.finding,
            t.history,

            -- Department Details
            d.dept_name,
            d.hodname,
            d.dept_username,

            -- Patient Details
            u.userid AS patient_id,
            u.fullname AS patient_name,
            u.email AS patient_email,
            u.role AS patient_role

        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN department d ON a.dept_id = d.dept_id
        LEFT JOIN user u ON t.patientid = u.userid
        LEFT JOIN doctor doc on a.doctor_id = doc.doctor_id

        WHERE a.dept_id = ? 
        And doc.doctor_id=? 
          AND a.status = 'Scheduled'
          AND DATE(a.appointment_date) = CURDATE()
    `;

    conn.query(sql, [req.params.id, req.params.user_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length === 0) {
            res.status(200).json({ message: 'No appointment for today' });
        } else {
            res.status(200).json({ result });
        }
    });
});

app.get("/api/getTreatmentDetails/:appointment_id", (req, res) => {
    const sql = `select * from appointment a 
                 t.treatment_name , t.issue_date , t.finding , t.history ,
                 c.issue_reported ,
                 left join treatment_details t on a.treatment_id=t.treatment_id
                 left join cheif_complaint c on t.complaint_id=c.complaint_id

                where appointment_id=? `
})


app.get('/getScheduledAppointments/:id', (req, res) => {
    const sql = `
        SELECT 
            a.appointment_id,
            a.treatment_id,
            a.appointment_date,
            a.dept_id,
            a.status AS appointment_status,

            -- Treatment Details
            t.treatment_name,
            t.issue_date,
            t.status AS treatment_status,
            t.total_charges,
            t.finding,
            t.history,

            -- Department Details
            d.dept_name,
            d.hodname,
            d.dept_username,

            -- Patient Details
            u.userid AS patient_id,
            u.fullname AS patient_name,
            u.email AS patient_email,
            u.role AS patient_role

        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN department d ON a.dept_id = d.dept_id
        LEFT JOIN user u ON t.patientid = u.userid

        WHERE a.dept_id = ?
          AND a.status = 'Scheduled' and a.payment_status='unpaid'
    `;

    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length === 0) {
            res.status(200).json({ message: 'No scheduled appointments found' });
        } else {
            res.status(200).json({ result });
        }
    });
});


/* app.get('/getInProgressAppointments/:id', (req, res) => {
    const sql = `
        SELECT 
            a.appointment_id,
            a.treatment_id,
            a.appointment_date,
            a.dept_id,
            a.status AS appointment_status,

            -- Treatment Details
            t.treatment_name,
            t.issue_date,
            t.status AS treatment_status,
            t.total_charges,
            t.finding,
            t.history,

            -- Department Details
            d.dept_name,
            d.hodname,
            d.dept_username,

            -- Patient Details
            u.userid AS patient_id,
            u.fullname AS patient_name,
            u.email AS patient_email,
            u.role AS patient_role

        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN department d ON a.dept_id = d.dept_id
        LEFT JOIN user u ON t.patientid = u.userid

        WHERE a.dept_id = ?
          AND a.status = 'Scheduled' and a.payment_status='paid'
    `;

    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length === 0) {
            res.status(200).json({ message: 'No scheduled appointments found' });
        } else {
            res.status(200).json({ result });
        }
    });
}); */



app.get('/getcompletedAppointments/:id', (req, res) => {
    const sql = `
        SELECT 
            a.appointment_id,
            a.treatment_id,
            a.appointment_date,
            a.dept_id,
            a.status AS appointment_status,

            -- Treatment Details
            t.treatment_name,
            t.issue_date,
            t.status AS treatment_status,
            t.total_charges,
            t.finding,
            t.history,

            -- Department Details
            d.dept_name,
            d.hodname,
            d.dept_username,

            -- Patient Details
            u.userid AS patient_id,
            u.fullname AS patient_name,
            u.email AS patient_email,
            u.role AS patient_role

        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN department d ON a.dept_id = d.dept_id
        LEFT JOIN user u ON t.patientid = u.userid

        WHERE a.dept_id = ?
          AND a.status = 'completed' and a.payment_status='paid'
    `;

    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length === 0) {
            res.status(200).json({ message: 'No scheduled appointments found' });
        } else {
            res.status(200).json({ result });
        }
    });
});


app.get('/api/getTreatments/:deptid', (req, res) => {
    const query = "select * from treatment_chart where dept_id = ?"
    conn.query(query, [req.params.deptid], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result)
        }
    });
})


app.get('/api/getDepartments', (req, res) => {
    const query = "select * from department"
    conn.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result)
        }
    });
})


app.get("/api/getUnAssignedPatients/:deptId", (req, res) => {
    const sql = `
    SELECT 
        t.*,
        u.fullname AS patient_name,
        u.phone AS patient_phone
        FROM treatment_details t
        LEFT JOIN user u ON t.patientid = u.userid
        WHERE t.dept_id = ? 
        AND t.status <> 'completed'
        AND t.payment_status='Paid'
        AND t.status <> 'Assigned';

`;


    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get("/api/getUnPaidAssignedPatients/:deptId", (req, res) => {
    const sql = `
    SELECT 
        t.*,
        u.fullname AS patient_name,
        u.phone AS patient_phone
        FROM treatment_details t
        LEFT JOIN user u ON t.patientid = u.userid
        WHERE t.dept_id = ? 
        AND t.status <> 'completed'
        AND t.payment_status='Unpaid'
        AND t.status <> 'Assigned';

`;


    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
});



app.get("/api/getInProgressAppointments/:deptId", (req, res) => {
    const sql = `
    SELECT 
        t.*,
        d.*,
        do.fullname as doctor_name,
        a.appointment_date as appointment_date, 
        a.status as appointment_status,
        u.fullname AS patient_name,
        u.phone AS patient_phone
        FROM treatment_details t
        LEFT JOIN user u ON t.patientid = u.userid
        LEFT JOIN appointment a ON t.treatment_id = a.treatment_id
        LEFT JOIN department d ON t.dept_id = a.dept_id
        LEFT join doctor do on a.doctor_id=do.doctor_id
        WHERE t.dept_id = ? 
        AND t.status <> 'completed'
        AND t.payment_status='Paid'
        AND a.status = 'Assigned'
        AND t.status = 'Assigned';

`;


    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
});

app.get("/api/getAppointments/:deptId", (req, res) => {
    const sql = `
        SELECT 
            a.*,
            t.treatment_name,
            u.fullname AS patient_name,
            u.phone AS patient_phone
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user u ON t.patientid = u.userid
        WHERE a.dept_id = ?
        AND DATE(a.appointment_date) = CURDATE()
    `;
    
    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
});



app.post('/api/allocateDoctor', (req, res) => {
    const insertSql = "insert into appointment(appointment_id , treatment_id , appointment_date ,dept_id , status , doctor_id) values(?,?,?,?,?,?)"
    appointment_date = new Date();
    appointment_id = unique();
    appStatus = "Scheduled";
    const { treatment_id, dept_id, doctor_id } = req.body;
    conn.query(insertSql, [appointment_id, treatment_id, appointment_date, dept_id, appStatus, doctor_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            //res.status(201).json({ message: 'Doctor allocated successfully', appointment: { appointment_id, treatment_id, appointment_date, dept_id, appStatus, doctor_id } });
            const updateSql = "update treatment_details set status='Assigned' where treatment_id=?"
            conn.query(updateSql, [treatment_id], (error, UpdateResult) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(201).json({ message: 'Doctor allocated successfully', appointment: { appointment_id, treatment_id, appointment_date, dept_id, appStatus, doctor_id } });
                }
            })
        }
    });
})



app.get("/api/appointmentsCompletedToday/:deptId", (req, res) => {
    const sql = `
        SELECT 
            a.*,
            t.treatment_name,
            t.status,
            u.fullname AS patient_name,
            u.phone AS patient_phone,
            d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user u ON t.patientid = u.userid
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        WHERE a.dept_id = ?
          AND a.status = 'completed'
          AND DATE(a.appointment_date) = CURDATE()
    `;

    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(result);
    });
});


app.get("/api/appointmentsCompletedYesterday/:deptId", (req, res) => {
    const sql = `
        SELECT 
            a.*,
            t.treatment_name,
            t.status,
            u.fullname AS patient_name,
            u.phone AS patient_phone,
            d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user u ON t.patientid = u.userid
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        WHERE a.dept_id = ?
          AND a.status = 'completed'
          AND DATE(a.appointment_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    `;
    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        res.status(200).json(result);
    });
});


app.get("/api/appointmentsCompletedLastWeek/:deptId", (req, res) => {
    const sql = `
        SELECT 
            a.*,
            t.treatment_name,
            t.status,
            u.fullname AS patient_name,
            u.phone AS patient_phone,
            d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user u ON t.patientid = u.userid
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        WHERE a.dept_id = ?
          AND a.status = 'completed'
          AND DATE(a.appointment_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
    `;
    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        res.status(200).json(result);
    });
});



app.get("/api/appointmentsCompleted/:deptId", (req, res) => {
    const sql = `
        SELECT 
            a.*,
            t.treatment_name,
            t.status,
            t.issue_date,
            u.fullname AS patient_name,
            u.phone AS patient_phone,
            d.fullname as doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user u ON t.patientid = u.userid
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        WHERE a.dept_id = ?
          AND a.status = 'completed'
         
    `;

    conn.query(sql, [req.params.deptId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(result);
    });
});


app.get("/api/appointments/completed/:deptId/doctor/:doctorId/:date", (req, res) => {
    const sql = `
        SELECT 
            a.*,
            t.treatment_name,
            t.treatment_status,
            u.fullname AS patient_name,
            u.phone AS patient_phone,
            d.doctor_name
        FROM appointment a
        LEFT JOIN treatment_details t ON a.treatment_id = t.treatment_id
        LEFT JOIN user u ON t.patientid = u.userid
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        WHERE a.dept_id = ?
          AND a.doctor_id = ?
          AND a.status = 'completed'
          AND DATE(a.appointment_date) = CURDATE()
    `;

    conn.query(sql, [req.params.deptId, req.params.doctorId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(result);
    });
});
