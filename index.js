const con=require('./db.js')
const app=require('./express.js')
const { verifyToken } = require('./jwt');
app.use(verifyToken);
const auth=require('./auth/api.js')
const department=require('./department/api.js')
const admin=require('./admin/api.js')
const clerk=require('./clerk/api.js')
const doctor=require('./doctor/api.js') 
const patient=require('./patient/api.js') 
/* const unique=require('./uniqueId.js')
console.error(unique()) */