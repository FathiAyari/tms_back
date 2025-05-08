// Middleware to check if the user has the required role
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        // If the user's role is not in the allowed roles list, deny access
        if (!roles.includes(userRole)) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        next();
    };
};

module.exports = roleMiddleware;
