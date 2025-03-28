import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization        
        
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }
        const token = authHeader.split(" ")[1]
        
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(token_decoded);
        req.body.userId = token_decoded.id
        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export default userAuth