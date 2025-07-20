const jwt = require('jsonwebtoken')

exports.authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]
    console.log(token)
    if (!token) {
        return res.status(401).json({ success: false, messages: 'Lỗi ko thấy token' })
    }

    try {
        const encoded = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = encoded
        next()
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

exports.authRole = (roles) => {
    return (req, res, next) => {
        // console.log(req.user.role)
        if(!req.user.role || !roles.includes(req.user.role)){
            return res.status(403).json({success: false, message: 'Không tìm thấy thông tin'})
        }
        next()
    }
}