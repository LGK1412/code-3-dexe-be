const jwt = require('jsonwebtoken')

exports.test = async (req, res) => {
    try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODI5YmNlNmU1MDI0NGVhYzU1NDExNzUiLCJlbWFpbCI6InRoYWlpZGk0MjVAZ21haWwuY29tIiwidmVyaWZpZWQiOnRydWUsImlhdCI6MTc0ODUwNDIyMywiZXhwIjoxNzU1NzYxODIzfQ.Vuczfu5vG_Pt5DRdOarkc-9R584sWzAxSkQd_xn117o"
        const result = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log(result)
        res.status(200).json({ success: true, message: 'You register successfully' })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.setCookieTest = async (req, res) => {
    try {
        res.cookie('myToken', 'LGK1412', {
            httpOnly: true,
            maxAge: 60 * 1000
        });
        res.status(200).json({ message: 'Cookie set!' });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.checkCokieTest = async (req, res) => {
    try {
        const cookie = req.cookies.myToken

        if(!cookie){
            return res.status(400).json({ message: 'No cookie found' });
        }

        res.status(200).json({message: cookie});
    } catch (error) {
        res.status(500).json(error);
    }
}