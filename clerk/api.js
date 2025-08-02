const app=require('../express.js')
const conn=require('../db.js')
const unique = require('../uniqueId.js')

app.get('/get-clerks', (req, res)=>{
    const sql="select * from user where role='Clerk'"
         conn.query(sql, (err, userResult) => {
                if (err) {
                    console.error('Fetch after update error:', err);
                    res.status(500).json({ error: 'Failed to fetch clerk details' });
                } else {
                    res.status(200).json({ message: 'Fetched Clerk Details', user: userResult });
                }
            });

})


app.get('/get-patients', (req, res)=>{
    const sql="select * from user where role='Patient'"
         conn.query(sql, (err, userResult) => {
                if (err) {
                    console.error('Fetch after update error:', err);
                    res.status(500).json({ error: 'Failed to fetch patient details' });
                } else {
                    res.status(200).json({ message: 'Fetched patient Details', user: userResult });
                }
            });

})

app.post('/update-patient/:id', (req, res) => {
    const userId = req.params.id;

    const encodedPassword = Buffer.from(req.body.password, 'utf-8').toString('base64');

    const sql = `
        UPDATE user SET
            email = ?,
            password = ?,
            fullname = ?,
            address = ?,
            gender = ?,
            marital_status = ?,
            dob = ?,
            role = ?,
            phone = ?,
            emergency_contact = ?,
            emergency_name = ?,
            registration_payment_type = ?
        WHERE userid = ?
    `;

    const values = [
        req.body.email,
        encodedPassword,
        req.body.fullname,
        req.body.address,
        req.body.gender,
        req.body.marital_status,
        req.body.dob,
        'Patient',
        req.body.phone,
        req.body.emergency_contact,
        req.body.emergency_name,
        req.body.registration_payment_type,
        userId
    ];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            res.status(500).json({ error: 'Internal server error during update' });
        } else {
            // Fetch updated user details
            const getUserSql = "SELECT * FROM user WHERE userid = ?";
            conn.query(getUserSql, [userId], (err, userResult) => {
                if (err) {
                    console.error('Fetch after update error:', err);
                    res.status(500).json({ error: 'Updated, but failed to fetch user data' });
                } else {
                    res.status(200).json({ message: 'User updated successfully', user: userResult[0] });
                }
            });
        }
    });
});
