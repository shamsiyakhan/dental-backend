const app = require('../express.js')
const conn = require('../db.js')
const unique = require('../uniqueId.js')


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
    const date = new Date();

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
    const sql="insert into appointment(appointment_id , treatment_id , appointment_date  , dept_id , status , payment_status)values(?,?,?,?,?,?)"
    conn.query(sql,[testid, req.body.treatment_id , req.body.appointment_date , req.body.dept_id ,  req.body.status , req.body.payment_status ],(err, result) => {
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

            }})
        }
    })
})

app.post('/updateComplete', (req, res) => {
    const sql = "update treatment_details set  finding=? ,history=? where treatment_id=?"
    conn.query(sql, [ req.body.finding, req.body.history , req.body.treatment_id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            const sql1 = "update appointment set status='completed' where treatment_id=?"
            conn.query(sql1, [ req.body.treatment_id], (err, result) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({ error: 'Internal server error' })
                } else {
                     res.status(200).json({ message: 'Appointment Updated Successfully' })
                }
            })
        }
    })
})

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


app.get('/getTodayAppointment/:id', (req, res) => {
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
          AND DATE(a.appointment_date) = CURDATE()
    `;

    conn.query(sql, [req.params.id], (err, result) => {
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


app.get('/getInProgressAppointments/:id', (req, res) => {
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
});



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
