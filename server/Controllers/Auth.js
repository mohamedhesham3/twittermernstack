const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../confgis/Cloud");
const Userschema = require("../models/User");
const User = require("../models/User");
require("dotenv").config();

const register = async (req, res) => {
  const { Username, Email, Password, Bio } = req.body;

  if (!Username || !Email || !Password) {
    return res.status(400).json({ message: "Username, Email, and Password are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (Password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  let avatarUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg";
  let bio = Bio || "i love twitter";

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
      });
      avatarUrl = result.url;
    }

    const existingUser = await Userschema.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new Userschema({
      Username,
      Email,
      Password: hashedPassword,
      Avatar: avatarUrl,
      Bio,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userid: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "User registered successfully.",
      token,
      userid: newUser._id,
    });

  } catch (error) {
    console.error("Error in register function:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

   

const login = async (req, res) => {
  const { Username, Password } = req.body;

  try {
    const user = await Userschema.findOne({ Username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ userid: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    return res
      .status(200)
      .json({ message: "User logged in.", token, userid: user.id });
  } catch (error) {
    console.error("Error in login function:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

const findUser = async (req, res) => {
  const { userid } = req.params;

  try {
    const user = await User.findById(userid)
      .populate("Posts", "Caption Image author likes comments")
      .populate("ChatRoom")
      .populate({
        path: "bookmarks",
        select: "Caption Image author",
        populate: {
          path: "author",
          select: "Username Avatar",
        },
      })
      .exec();
    if (!user) {
      return res.status(404).json({ message: "Invalid userID" });
    }
    res.json({ userdata: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const findallusers = async (req, res) => {
  try {
    const user = await User.find()
      .populate("Posts", "Caption Image author likes comments")
      .populate("ChatRoom");
    if (!user) {
      return res.status(404).json({ message: "Invalid userID" });
    }
    res.json({ userdata: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getuserbyname = async (req, res) => {
  const { Username } = req.query;

  try {
    if (!Username) {
      return res.status(400).json({ error: "Username parameter is required" });
    }

    const filteredUsers = await User.find({
      Username: { $regex: new RegExp(Username, "i") },
    });
    res.json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const changeuseravatar = async(req,res) => {
     const{userid}=req.params
     const avatar=req.file

     try {
          const result = await cloudinary.uploader.upload(avatar.path, {
               public_id: `${Date.now()}`,
               resource_type: "auto",
             });
             const user = await User.findByIdAndUpdate(userid, { Avatar: result.url }, { new: true });
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          res.json(user);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server Error' });
        }
}







const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is not provided' });
  }

  jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = decoded.userid; 
    next();
  });
};

module.exports = {
  login,
  register,
  findUser,
  verifyToken,
  findallusers,
  getuserbyname,
  changeuseravatar,
};
