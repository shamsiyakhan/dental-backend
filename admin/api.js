const app = require('../express.js')
const conn = require('../db.js')
const unique = require('../uniqueId.js')
const { generateToken } = require('.././jwt');
const sendEmail = require('../mail.js')

app.post("/add-admin", (req, res) => {
    const adminid = unique()
    const sql = "insert into admin(admin_id , fullname , email , password ,phone) values (?,?,?,?,?)"
    conn.query(sql, [adminid, req.body.fullname, req.body.email, req.body.password, req.body.phone], (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        } else {
            res.status(200).send({ result: "Admin added successfully" })
        }
    })
})


app.post("/add-clerk", (req, res) => {
    const clerid = unique()
    const sql = "insert into user(userid , email , password ,fullname , address , gender , marital_status , dob , role , phone , emergency_contact , emergency_name) values (?,?,?,?,? , ?,?,?,?,?,?,?    )"
    conn.query(sql, [clerid, req.body.email, req.body.password, req.body.fullname, req.body.address, req.body.gender, req.body.marital_status, req.body.dob, 'Clerk', req.body.phone, req.body.emergency_contact, req.body.emergency_name], (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        } else {
            res.status(200).send({ result: "Clerk added successfully" })
        }
    })
})



app.post("/admin-login", (req, res) => {
    const adminid = unique()
    const sql = "select * from admin where email=? and password=?"
    conn.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        } else {
            if (result.length > 0) {
                const token = generateToken(result[0].role, result[0].fullname);
                res.status(200).json({ message: 'Login successful', user: result[0], token: token })
            } else {
                res.status(401).send({ error: "Invalid Username or password" })
            }

        }
    })
})


app.post("/api/add-department", (req, res) => {
    const deptid = unique()
    const sql = "insert into department(dept_id , dept_name ,hodname , dept_username , dept_password) values(?,?,?,?,?)"
    conn.query(sql, [deptid, req.body.name, req.body.hodname, req.body.username, req.body.dept_password], (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        } else {
            res.status(200).send({ result: "Added Successfully" })
        }
    })

})


app.put("/api/update-department/:dept_id", (req, res) => {
    const deptId = req.params.dept_id;
    const { name, hodname, username, dept_password } = req.body;
    console.warn(req.body)

    const sql = `
        UPDATE department 
        SET dept_name = ?, hodname = ?, dept_username = ?, dept_password = ? 
        WHERE dept_id = ?
    `;

    conn.query(sql, [name, hodname, username, dept_password, deptId], (err, result) => {
        if (err) {
            res.status(500).send({ error: err });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send({ result: "Department not found" });
            } else {
                res.status(200).send({ result: "Updated Successfully" });
            }
        }
    });
});





app.post("/add-charges", (req, res) => {
    const treatmentId = unique()
    const sql = "insert into treatment_master(treatment_id , treatment_name, treatment_price ,type)values(?,?,?,?)"
    conn.query(sql, [treatmentId, req.body.treatment_name, req.body.treatment_price, req.body.username, req.body.dept_password], (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        } else {
            res.status(200).send({ result: "Added Successfully" })
        }
    })

})


app.post('/addTests', (req, res) => {

    const testid = unique()
    const sql = "insert into treatment_master(treatment_id , treatment_name , treatment_price ,type , dept_id )values(?,?,?,?,?)"
    conn.query(sql, [testid, req.body.treatment_name, req.body.treatment_price, req.body.type, req.body.dept_id], (err, result) => {
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
    const sql = "insert into treatment_master(treatment_id , treatment_name , treatment_price ,type , dept_id )values(?,?,?,?,?)"
    conn.query(sql, [testid, req.body.treatment_name, req.body.treatment_price, req.body.type, req.body.dept_id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Treatment Added Successfully' })
        }
    })

})


app.get('/getTests/:id', (req, res) => {
    const sql = "select * from treatment_master where dept_id=? and type='Test'"
    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send({ error: 'Internal server error' })
        } else {
            res.status(200).send({ result: result })
        }
    })
})


app.get('/api/getDepartments', (req, res) => {
    const sql = "select * from department"
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        } else {
            console.warn(result)
            res.status(200).send({ result: result })
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

app.delete('/api/deleteTreatment/:treatmentId', (req, res) => {
    const treatmentId = req.params.treatmentId;
    const deleteSubcategoriesSql = 'DELETE FROM treatment_subcategory WHERE treatment_id = ?';
    const deleteTreatmentSql = 'DELETE FROM treatment_chart WHERE treatment_id = ?';

    conn.query(deleteSubcategoriesSql, [treatmentId], (subErr, subResult) => {
        if (subErr) {
            console.error('Failed to delete subcategories:', subErr);
            return res.status(500).json({ error: 'Failed to delete treatment' });
        }

        conn.query(deleteTreatmentSql, [treatmentId], (err, result) => {
            if (err) {
                console.error('Failed to delete treatment:', err);
                return res.status(500).json({ error: 'Failed to delete treatment' });
            }

            console.warn('Treatment deleted successfully:', result);
            return res.status(200).json({ message: 'Treatment deleted successfully' });
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
            ts.step_sequence,
            ts.step_charges
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
                    step_sequence: row.step_sequence,
                    step_charges: row.step_charges
                });
            }
        });

        const treatmentsArray = Object.values(treatmentsMap);

        return res.status(200).json({ treatments: treatmentsArray });
    });
});


app.get('/api/getDepartment/:deptId', (req, res) => {
    const deptId = req.params.deptId;
    const sql = "SELECT * FROM department WHERE dept_id = ?";
    conn.query(sql, [deptId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal server error' });
        } else {
            if (result.length === 0) {
                res.status(404).send({ error: 'Department not found' });
            } else {
                res.status(200).send({ result: result[0] });
            }
        }
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


app.post('/api/getAdmins', (req, res) => {
    const sql = "select * from admin where admin_id=?"
    conn.query(sql, [req.body.id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send({ error: 'Internal server error' })
        } else {
            res.status(200).send({ result: result })
        }
    })
})


app.post('/api/updateAdminDetails', (req, res) => {
    const sql = "update admin set fullname=? , email=? , phone=? , dob=? , gender=? , marital_status=? , address=? where admin_id=? "
    conn.query(sql, [req.body.fullname, req.body.email, req.body.phone, req.body.dob, req.body.gender, req.body.marital_status, req.body.address, req.body.id], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send({ error: 'Internal server error' })
        } else {
            res.status(200).send({ msg: "Updated Successfully" })
        }
    })
})


app.post('/api/addDoctor', (req, res) => {
    const doctorId = unique();
    const { fullname, email, phone, password, gender, marital_status, address, department } = req.body;

    const sql = "INSERT INTO doctor (doctor_id, fullname, email, phone_no, password , gender , marital_status,address,onboarding_status, dept_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    conn.query(sql, [doctorId, fullname, email, phone, password, gender, marital_status, address, "False", department], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const onboardingLink = `http://localhost:4200/auth/doctor/onboarding/${doctorId}`;

        // Email ka content
        const text = `
    Dear ${fullname},

    Your doctor account has been created successfully. 🎉

    To activate your account, please go through the onboarding process by clicking the link below:

    ${onboardingLink}

    Regards,
    DCPMS Team
    `;

        // Email bhejna
        sendEmail(email, 'Doctor Account Created - Action Required', text);
        res.status(201).json({ message: 'Doctor added successfully', doctorId });
    });
});

app.get('/api/getDoctors/:id', (req, res) => {
    const sql = "select * from doctor where dept_id= ?";
    conn.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal server error' });
        } else {
            res.status(200).send({ result: result });
        }
    });
});



app.post("/add-accountant", (req, res) => {
    const clerid = unique()
    const sql = "insert into user(userid , email , password ,fullname , address , gender , marital_status , dob , role , phone , emergency_contact , emergency_name) values (?,?,?,?,? , ?,?,?,?,?,?,?    )"
    conn.query(sql, [clerid, req.body.email, req.body.password, req.body.fullname, req.body.address, req.body.gender, req.body.marital_status, req.body.dob, 'Accountant', req.body.phone, req.body.emergency_contact, req.body.emergency_name], (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        } else {
            res.status(200).send({ result: "Clerk added successfully" })
        }
    })
})

app.get("/get-accountant" , (req , res)=>{
    const sql="select userid , email  ,fullname , address , gender , marital_status , dob  , phone , emergency_contact , emergency_name from user where role='Accountant'"
    conn.query(sql , (err , result)=>{
        if (err) {
            res.status(500).send({ error: err })
        } else {
            res.status(200).send({ result: result })
        }
    })
})


app.get('/api/totalRevenue', (req, res) => {
  try {
    const sql = `
      SELECT SUM(payment_amount) AS total_success_amount
      FROM payments
      WHERE payment_status = 'Success'
    `;

    conn.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ success: false, message: 'Database query failed' });
      }

      const total = result[0].total_success_amount || 0;
      res.json({ success: true, total_success_amount: total });
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('/api/unpaidTreatments', (req, res) => {
  try {
    const sql = `
      SELECT 
        COUNT(*) AS unpaid_count,
        SUM(CAST(total_charges AS DECIMAL(10,2))) AS total_unpaid_amount
      FROM treatment_details
      WHERE payment_status = 'UnPaid'
    `;

    conn.query(sql, (err, summaryResult) => {
      if (err) {
        console.error('Error fetching summary:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      const summary = summaryResult[0];
      const unpaidCount = summary.unpaid_count || 0;
      const totalUnpaid = summary.total_unpaid_amount || 0;

      // Now get list of unpaid treatments
      const listSql = `
        SELECT 
          treatment_id, 
          treatment_name, 
          issue_date, 
          status, 
          total_charges, 
          doctorid, 
          patientid, 
          dept_id
        FROM treatment_details
        WHERE payment_status = 'UnPaid'
      `;

      conn.query(listSql, (err, listResult) => {
        if (err) {
          console.error('Error fetching list:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.json({
          success: true,
          unpaid_count: unpaidCount,
          total_unpaid_amount: totalUnpaid,
          unpaid_list: listResult
        });
      });
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('/api/todaysPayments', (req, res) => {
  try {
    // Step 1: Query total + count for today's successful payments
    const summarySql = `
      SELECT 
        COUNT(*) AS total_count,
        SUM(payment_amount) AS total_amount
      FROM payments
      WHERE payment_status = 'Success'
        AND DATE(payment_date) = CURDATE()
    `;

    conn.query(summarySql, (err, summaryResult) => {
      if (err) {
        console.error('Error fetching summary:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      const summary = summaryResult[0];
      const totalCount = summary.total_count || 0;
      const totalAmount = summary.total_amount || 0;

      // Step 2: Query the list of today’s successful payments
      const listSql = `
        SELECT 
          payment_id,
          payment_date,
          payment_amount,
          payment_type,
          transaction_id,
          upi_app,
          card_last4,
          treatment_id,
          complaint_id
        FROM payments
        WHERE payment_status = 'Success'
          AND DATE(payment_date) = CURDATE()
        ORDER BY payment_date DESC
      `;

      conn.query(listSql, (err, listResult) => {
        if (err) {
          console.error('Error fetching list:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.json({
          success: true,
          total_count: totalCount,
          total_amount: totalAmount,
          payments_list: listResult
        });
      });
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/unpaidTreatmentsList', (req, res) => {
  try {
    // Step 1️⃣ — Get unpaid summary
    const summarySql = `
      SELECT 
        COUNT(*) AS unpaid_count,
        SUM(CAST(total_charges AS DECIMAL(10,2))) AS total_unpaid_amount
      FROM treatment_details
      WHERE payment_status = 'UnPaid'
    `;

    conn.query(summarySql, (err, summaryResult) => {
      if (err) {
        console.error('❌ Error fetching summary:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error fetching unpaid summary'
        });
      }

      const summary = summaryResult[0] || {};
      const unpaidCount = summary.unpaid_count || 0;
      const totalUnpaid = summary.total_unpaid_amount || 0;

      // Step 2️⃣ — Get unpaid treatments with department name + patient name
      const listSql = `
        SELECT 
          t.treatment_id,
          t.treatment_name,
          t.issue_date,
          t.status,
          CAST(t.total_charges AS DECIMAL(10,2)) AS total_charges,
          t.payment_status,
          d.dept_name AS department_name,
          u.fullname AS patient_name,
          t.doctorid
        FROM treatment_details AS t
        LEFT JOIN department AS d ON d.dept_id = t.dept_id
        LEFT JOIN user AS u ON u.userid = t.patientid
        WHERE t.payment_status = 'UnPaid'
        ORDER BY t.issue_date DESC
      `;

      conn.query(listSql, (err, listResult) => {
        if (err) {
          console.error('❌ Error fetching unpaid list:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error fetching unpaid list'
          });
        }

        // Step 3️⃣ — Final response
        res.json({
          success: true,
          unpaid_count: unpaidCount,
          total_unpaid_amount: totalUnpaid,
          unpaid_list: listResult || []
        });
      });
    });

  } catch (error) {
    console.error('⚠️ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


app.get('/api/patientsUnpaidSummary', (req, res) => {
  try {
    const sql = `
      SELECT 
        u.userid,
        u.fullname,
        u.email,
        u.phone,
        u.address,
        u.gender,
        u.dob,
        COALESCE(SUM(CAST(t.total_charges AS DECIMAL(10,2))), 0) AS total_unpaid_amount,
        COUNT(t.treatment_id) AS unpaid_treatments
      FROM user AS u
      LEFT JOIN treatment_details AS t 
        ON t.patientid = u.userid AND t.payment_status = 'UnPaid'
      WHERE LOWER(u.role) = 'patient'
      GROUP BY 
        u.userid, u.fullname, u.email, u.phone, 
        u.address, u.gender, u.dob
      ORDER BY total_unpaid_amount DESC;
    `;

    conn.query(sql, (err, result) => {
      if (err) {
        console.error('❌ Error executing query:', err);
        return res.status(500).json({
          success: false,
          message: 'Database query failed'
        });
      }

      res.json({
        success: true,
        count: result.length,
        patients: result
      });
    });

  } catch (error) {
    console.error('⚠️ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


app.get('/api/patientTreatments/:patientid', (req, res) => {
  try {
    const { patientid } = req.params;

    // Validate input
    if (!patientid) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    const sql = `
      SELECT 
        t.treatment_id,
        t.treatment_name,
        t.issue_date,
        t.status,
        CAST(t.total_charges AS DECIMAL(10,2)) AS total_charges,
        t.finding,
        t.history,
        t.payment_status,
        d.dept_name AS department_name,
        u.fullname AS patient_name,
        doc.fullname AS doctor_name
      FROM treatment_details AS t
      LEFT JOIN department AS d ON d.dept_id = t.dept_id
      LEFT JOIN user AS u ON u.userid = t.patientid
      LEFT JOIN user AS doc ON doc.userid = t.doctorid
      WHERE t.patientid = ?
      ORDER BY t.issue_date DESC
    `;

    conn.query(sql, [patientid], (err, result) => {
      if (err) {
        console.error('❌ Error fetching treatments:', err);
        return res.status(500).json({
          success: false,
          message: 'Database query failed'
        });
      }

      res.json({
        success: true,
        count: result.length,
        treatments: result
      });
    });

  } catch (error) {
    console.error('⚠️ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

