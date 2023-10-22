import jwt from 'jsonwebtoken'
export const authenticateUser = (req, res, next) => {
    try {
        const token = (req.headers['authorization'])?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'Access denied. No token provided.'
            })

        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: 'Access Denied'
                })
            }

            req.user = user;
            next();
        });
    } catch (error) {

    }
}

export const authorizeUser = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user.userType; // user role is stored in req.user

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'Access forbidden. You do not have the required permissions.' });
        }

        next();
    };
};
