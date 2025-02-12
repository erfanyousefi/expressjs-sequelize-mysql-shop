const createHttpError = require("http-errors");
const {User} = require("../user/user.model");
const jwt = require("jsonwebtoken");
async function AuthGuard (req, res, next) {
    try {
        const authorization = req?.headers?.authorization ?? undefined;
        if (!authorization) throw createHttpError(401, "login on your account");
        const [bearer, token] = authorization?.split(" ");
        if (!bearer || bearer?.toLowerCase() !== "bearer") throw createHttpError(401, "login on your account");
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (verified?.userId) {
            const user = await User.findByPk(verified?.userId);
            if (!user) throw createHttpError(401, "login on your account");
            req.user = {
                id: user.id,
                mobile: user?.mobile,
                fullname: user?.fullname,
            };
            return next();
        }
        throw createHttpError(401, "login on your account");
    } catch (error) {
        next(error);
    }
}

module.exports = AuthGuard;