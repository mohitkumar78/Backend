import { asyncHandller } from "../utils/asyncHandller.js";
import { ApiErorHandling } from "../utils/APIErrorhandling.js"
import { User } from "../models/user.models.js";
import { fileUploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";
import { set } from "mongoose";


const generateAccessAndrefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!process.env.ACCESS_TN_SECREOKET || !process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("JWT secret not defined in environment variables");
        }

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;

        user.save({
            validateBeforeSave: false,
        });

        console.log("tokens are -----------");
        console.log(refreshToken);
        console.log(accessToken);

        if (!refreshToken || !accessToken) {
            throw new Error("Error generating tokens");
        }

        return {
            refreshToken,
            accessToken,
        };
    } catch (error) {
        console.log("error occur while generating Token", error);
    }
};

const registerUser = asyncHandller(async (req, res) => {
    const { userName, email, fullname, password } = req.body;
    console.log("email", email);
    if ([userName, email, fullname, password].some((field) => {
        field?.trim() === ""
    })) {
        throw new ApiErorHandling(400, "All field are required")
    }


    const ExstingUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (ExstingUser) {
        throw new ApiErorHandling(409, "user is allready Existing");
    }
    const avtarLocalPath = await req.files?.avatar[0]?.path
    console.log(avtarLocalPath)
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avtarLocalPath) {
        throw new ApiErorHandling(400, "AvtarlocalPath is not get")
    }

    const AvtarUpload = await fileUploadOnCloudinary(avtarLocalPath)
    const coverImgUpload = await fileUploadOnCloudinary(coverImageLocalPath)


    if (AvtarUpload == null) {
        throw new ApiErorHandling(400, 'avtar is not uploaded on cloudinary')
    }

    const user = await User.create(
        {
            userName,
            email,
            fullname,
            password,
            avatar: AvtarUpload.url,
            coverImage: coverImgUpload.url || "",
        }
    )

    const userCreation = await User.findById(user._id).select(
        "-password  -refreshToken"
    )

    if (!userCreation) {
        throw new ApiErorHandling(500, 'user is not created')
    }

    return res.status(202).json(
        new ApiResponse(200, userCreation, "user register sucessfully")
    )
})

const loginUser = asyncHandller(async (req, res) => {
    // data ->req.body
    //  username or email
    // find username
    // password check
    //acess and refresh token
    // res -> cokkie
    const { userName, email, password } = req.body;
    console.log(email)
    console.log(password)
    if (!userName) {
        throw new ApiErorHandling(401, "userName is required");
    }
    if (!email) {
        throw new ApiErorHandling(401, "email is requried");
    }


    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    /*      
      const user = await User.findOne(
          { $or: [{ userName }, { email }] },
          { password: 1 } // Exclude the 'password' field from the result
      );
  
  */
    // const user = await User.find({ email: email }, { email: 1, password: 1 })
    if (!user) {
        throw new ApiErorHandling(501, "user is not exist")
    }
    console.log(user)
    const isPasswordMatch = user.isPasswordCorrect(password, user._id)
    if (!isPasswordMatch) {
        throw new ApiErorHandling(401, "Incoorect password");
    }
    //  const loginUser = await User.findById(user._id).select("-password - refreshToken");
    const loginUser = await User.findById(user._id).select("-password -refreshToken");
    const { refreshToken, accessToken } = (await generateAccessAndrefreshToken(user._id)) || {};

    // const { refreshToken, accessToken } = await generateAccessAndrefreshToken(user._id);
    const option = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, {
                user: loginUser, accessToken, refreshToken
            },
                "user logedIn Sucessfully"
            )
        )


})

const logoutUser = asyncHandller(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:
            {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200)
        .clearCookie(accessToken, option)
        .clearCookie(refreshToken, option)
        .json(new ApiResponse(200, {}, "User Logout Sucessfully"))



})

export { registerUser, loginUser, logoutUser }