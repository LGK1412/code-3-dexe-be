const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('682663221551-gja7tocds42r31hdqhu99k97faq1nfu5.apps.googleusercontent.com'); // thay bằng clientId của mày

exports.verifyGoogleToken = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // console.log(token)

    try {
        // console.log('Verifying token:', token);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '682663221551-gja7tocds42r31hdqhu99k97faq1nfu5.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();

        const now = Math.floor(Date.now() / 1000); // thời gian hiện tại (epoch seconds)
        if (payload.exp < now) {
            return res.status(401).json({ error: 'Token expired' });
        }

        // console.log('Token payload:', payload);
        req.tokenPayload = payload; // gắn vào req để dùng tiếp
        // console.log(payload)
        next();
    } catch (err) {
        // console.log('Token verification error:', err);
        return res.status(401).json({ error: err });
    }
}

