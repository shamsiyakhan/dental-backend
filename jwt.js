
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(role, fullname) {
    const payload = { role, fullname };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

function verifyToken(req, res, next) {
    const publicRoutes = ['/login', '/register' , '/admin-login', '/clerklogin', '/deptlogin' , '/api/doctor-login'  ,'/api/OnboardingComplete' , '/api/getDoctorDetail'  , '/accountantLogin']; // ignored routes for jwt token verification
    console.warn(req.path);
   if (publicRoutes.some(route => req.path.includes(route))) {
    return next(); // Skip JWT check
}

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = {
    generateToken,
    verifyToken
};
