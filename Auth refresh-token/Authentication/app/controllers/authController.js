const register = require("../models/Register");
const httpStatusCode = require("../utils/httpStatuscode");
const httpstatuscode = require("../utils/httpStatuscode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// registeration
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    if (!name || !email || !password) {
      return res.status(httpstatuscode.BAD_REQUEST).json({
        sucess: false,
        message: "All Fields required",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await register.create({
      name,
      email,
      password: hashedPassword,
      profileImage: profileImage,
    });

    const userData = user.save();

    if (user) {
      return res.status(httpstatuscode.CREATED).json({
        sucess: true,
        message: "Registeration has been sucessfull",
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await register.findOne({ email });

    if (!user) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        sucess: false,
        message: "E-mail has been wrong",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        sucess: false,
        message: "password has been wrong",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.jwt_secret, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.jwt_secret, {
      expiresIn: "7d",
    });

    // Save it to the user in MongoDB [cite: 82]
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(httpStatusCode.OK).json({
      sucess: true,
      message: "Login Sucessfully",
      token: token,
      refreshToken: refreshToken,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// logout
exports.logoutUser = async (req, res) => {
  try {
    const userId = req?.user?.id;

    await register.findOneAndUpdate(userId, {
      refreshToken: "",
    });

    return res.status(httpStatusCode.OK).json({
      sucess: true,
      message: "Logout Successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

// refresh user

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    console.log("Searching for token:", token);

    const user = await register.findOne({ refreshToken: token });

    console.log("Searching for user:", user);

    if (!user) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        sucess: false,
        message: "Token not found in database. Please Login again.",
      });
    }

    const newAcessToken = jwt.sign({ id: user.id }, process.env.jwt_secret, {
      expiresIn: "1h",
    });

    return res.status(httpStatusCode.OK).json({
      sucesss: true,
      message: "Token refresh sucessfully",
      accesToken: newAcessToken,
    });
  } catch (err) {
    console.log(err);
  }
};
