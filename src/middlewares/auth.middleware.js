import { ApiErorHandling } from "../utils/APIErrorhandling.js";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asyncHandller } from "../utils/asyncHandller.js";

const jwtVerify = asyncHandller(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", '');

        if (!token) {
            throw new ApiErorHandling(400, "Critical error occurred");
        }

        const decodedToken = Jwt.verify(token, process.env.ACCESS_TN_SECREOKET); // Check the correct variable name
        const user = await User.findById(decodedToken._id).select(["-password", "-refreshToken"]);

        if (!user) {
            throw new ApiErorHandling(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiErorHandling(401, error?.message || "Invalid Access token");
    }
});

export { jwtVerify };


/*import { ApiErorHandling } from "../utils/APIErrorhandling.js";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asyncHandller } from "../utils/asyncHandller.js";

const jwtVerify = asyncHandller(async (res, req, next) => {
    try {
        const Token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", '');

        if (!Token) {
            throw new ApiErorHandling(400, "crisidicial went wrong")
        }
        const decodedToken = Jwt.verify(Token, process.env.ACCESS_TN_SECREOKET);
        const user = User.findById(decodedToken._id).select([
            "-password", "-refreshToken"
        ]
        )
        if (!user) {
            throw new ApiErorHandling(401, "Invalid acess token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiErorHandling(401, error?.message || "Invalid Acess token")
    }
})
export { jwtVerify };
*/