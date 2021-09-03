const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: (req, res, next) => {
        if(!req.body.email){
            return res.status(400).send({
                message: "กรุณากรอกอีเมลล์",
                status: 400
            });
        }

        if(!req.body.password || req.body.password.length < 8){
            return res.status(400).send({
                message: "กรุณากรอกรหัสผ่าน และตรวจสอบรหัสผ่านให้มากกว่า 8 ตัวอักษร",
                status: 400
            });
        }

        if(!req.body.repassword || req.body.password != req.body.repassword){
            return res.status(400).send({
                message: "ยืนยันรหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง",
                status: 400
            });
        }

        next();
    },
    isLoggedIn: (req, res, next) => {
        // console.log(req)
        if(!req.headers.authorization){
            return res.status(400).send({
                message: "กรุณาเข้าสู่ระบบใหม่",
                status: 400
            })
        }
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'SECRETKEY');
            req.userData = decoded;
            next();
        } catch(err) {
            return res.status(400).send({
                message: "กรุณาเข้าสู่ระบบใหม่",
                status: 400
            })
        }
    }
}