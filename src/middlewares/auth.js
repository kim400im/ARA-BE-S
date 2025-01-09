require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

const checkLogin = (req, res, next)=>{
    // const token =req.cookies.token;
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token)

    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    } try {
        const decoded = jwt.verify(token, jwtSecret);
        console.log(decoded);
        req.user = decoded;
        // req.user = { id: decoded.userId }; // 유저 정보를 req.user에 설정
        console.log("Decoded userId:", decoded.userId); // 디버깅 로그
        next();
    } catch(error){
        return res.status(403).json({ message: "Forbidden" });
    }
}

module.exports = checkLogin;