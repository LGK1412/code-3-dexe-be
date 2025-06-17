const jwt = require('jsonwebtoken');
const { acceptLogoutSchema } = require('./validator');
const usersModel = require('../models/users.model');

exports.identifyInfo = async (req, res, next) => {
    const { email, loginToken } = req.body;
    
    try {
        const { error } = acceptLogoutSchema.validate({ email, loginToken });
        if (error) return res.status(401).json({ success: false, message: error.details[0].message });

        const existingUser = await usersModel.findOne({ email }).select('+loginToken');
        if (!existingUser) return res.status(401).json({ success: false, message: 'User does not exist' });

        const tokenInfo = jwt.verify(loginToken, process.env.TOKEN_SECRET)
        const tokenInfoInDB = jwt.verify(existingUser.loginToken.toString(), process.env.TOKEN_SECRET)

        const allEmailsMatch =
            email === tokenInfo.email &&
            tokenInfo.email === tokenInfoInDB.email &&
            tokenInfoInDB.email === existingUser.email;

        const allVerified =
            tokenInfo.verified &&
            tokenInfoInDB.verified &&
            existingUser.verified;
        
        if (!allEmailsMatch || !allVerified) {
            return res.status(400).json({ success: false, message: 'Identification failed!' });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong: ' + error.message });
    }
};
