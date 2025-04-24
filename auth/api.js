const app=require('../express.js')
const conn=require('../db.js')
const unique = require('../uniqueId.js')


/* const encoded = Buffer.from('hello world', 'utf-8').toString('base64');   for encryption*/

/* const decoded = Buffer.from('aGVsbG8gd29ybGQ=', 'base64').toString('utf-8'); for decrpytion*/

app.post('/register', (req, res) => {

    const userId = unique()

    const encoded= Buffer.from(req.body.password, 'utf-8').toString('base64')
    const sql="insert into user(userid , email , password , fullname ,address ,gender , marital_status , dob ,role , phone , emergency_contact , emergency_name)values(?,?,?,?,?,?,?,?,?,?,?,?)"
    conn.query(sql,[userId, req.body.email , encoded , req.body.fullname , req.body.address ,req.body.gender, req.body.marital_status , req.body.dob, req.body.role ,req.body.phone , req.body.emergency_contact ,req.body.emergency_name ],(err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'User registered successfully' })
        }
    })
})


app.post('/login', (req, res) => { 

    const sql = "select * from user where email=?"
    conn.query(sql, [req.body.email], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else if (result.length === 0) {
            res.status(401).json({ error: 'Invalid email or password' })
        } else {
            const decoded = Buffer.from(result[0].password, 'base64').toString('utf-8')
            if (decoded === req.body.password) {
                res.status(200).json({ message: 'Login successful', user: result[0] })
            } else {
                res.status(401).json({ error: 'Invalid email or password' })
            }
        }
    })
})


app.post('/deptlogin', (req, res) => { 

    const sql = "select * from department where dept_username=? and dept_password=?"
    conn.query(sql, [req.body.dept_username , req.body.password], (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else if (result.length === 0) {
            res.status(401).json({ error: 'Invalid email or password' })
        } else if(result.length>0){
        
            res.status(200).json({ message: 'Login successful', user: result[0] })
        }
    })
})

app.post('/registerDepartment', (req, res) => {

    const deptId = unique()

    const encoded= Buffer.from(req.body.password, 'utf-8').toString('base64')
    const sql="insert into department(dept_id , dept_name , hodname , dept_username ,dept_password)values(?,?,?,?,?)"
    conn.query(sql,[deptId, req.body.dept_name , req.body.hodname , req.body.dept_username ,encoded ],(err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Department registered successfully' })
        }
    })
})


app.post('/registerDoctor', (req, res) => {

    const userId = unique()

    const encoded= Buffer.from(req.body.password, 'utf-8').toString('base64')
    const sql="insert into doctor(doctor_id , fullname , email , password , experience ,degree , phone_no , address ,gender , marital_status , dob ,dept_id)values(?,?,?,?,?,?,?,?,?, ? , ? , ? )"
    console.warn(req.body.dept_id)  
    conn.query(sql,[userId, req.body.fullname , req.body.email , encoded , req.body.experience ,req.body.degree, req.body.phone_no , req.body.address, req.body.gender , req.body.marital_status  , req.body.dob , req.body.dept_id ],(err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.status(200).json({ message: 'Doctor registered successfully' })
        }
    })
})