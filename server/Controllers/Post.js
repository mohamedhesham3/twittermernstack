const mongoose = require("mongoose");
const PostSchema = require("../models/PostSchema");
const cloudinary = require("../confgis/Cloud");
const User = require("../models/User"); 

const Post = async (req, res) => {
     try {
       const { userid } = req.params;
       const { Caption } = req.body;
       const Image = req.file;
   
       if (!Caption && !Image) {
         return res.status(400).json({ error: "Caption or Image is required." });
       }
   
       let newPost;
   
       if (Caption && !Image) {
         // Text-only post (no image)
         newPost = new PostSchema({
           author: userid,
           Caption: Caption,
         });
       } else if (!Caption && Image) {
         // Image-only post (no caption)
         const result = await cloudinary.uploader.upload(Image.path, {
           public_id: `${Date.now()}`,
           resource_type: "auto",
         });
   
         newPost = new PostSchema({
           author: userid,
           Image: result.secure_url,
         });
       } else {
        // Image-only post (no caption)
        const result = await cloudinary.uploader.upload(Image.path, {
          public_id: `${Date.now()}`,
          resource_type: "auto",
        });
  
        newPost = new PostSchema({
          Caption: Caption,
          author: userid,
          Image: result.secure_url,
        });
       }
   
       // Save the new post to the database
       await newPost.save();
   
       // Find the user by ID and update their Posts array with the new post ID
       const user = await User.findById(userid);
       if (!user) {
         return res.status(404).json({ error: "User not found" });
       }
   
       user.Posts.push(newPost._id);
       await user.save();
   
       // Return a successful response with the created post object
       return res.status(201).json({ post: newPost });
     } catch (error) {
       console.error(error);
       return res.status(500).json({ error: "Internal Server Error" });
     }
   };
   

const getpost = async (req, res) => {
  try {
    const { userid } = req.params;
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const posts = await PostSchema.find({ author: userid }).populate(
      "author",
      "Username Avatar"
    );
    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "No posts found for the user" });
    }

    res.json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getallposts = async (req, res) => {
  try {
    const allposts = await PostSchema.find().populate(
      "author",
      "Username Avatar"
    );
    res.json(allposts);
  } catch (error) {
    console.log(error);
  }
};

const getpostbyId = async (req, res) => {
  const { postid } = req.params;

  try {
    const postidd = await PostSchema.findById(postid)
      .populate("author", "Username Avatar")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "Username Avatar",
        },
      });
    res.send(postidd);
  } catch (error) {
    console.log(error);
  }
};
const likes = (io) => {
  io.on('connection', (socket) => {
    socket.on('addLike', async (data) => {
      try {
        let post = await PostSchema.findById(data.PostID);

        if (!post) {
          socket.emit('serverError', { message: 'Post not found' });
          return;
        }

        const userHasLiked = post.likes.includes(data.userid);

        let updatedPost;
        if (userHasLiked) {
          updatedPost = await PostSchema.findOneAndUpdate(
            { _id: data.PostID },
            { $pull: { likes: data.userid } },
            { new: true }
          );
        } else {
          updatedPost = await PostSchema.findOneAndUpdate(
            { _id: data.PostID },
            { $addToSet: { likes: data.userid } },
            { new: true }
          );
        }

        io.emit("likeUpdated", updatedPost);
      } catch (error) {
        console.error(error);
        socket.emit('serverError', { message: 'Server Error' });
      }
    });
  });
};


   

const comment = async (req, res) => {
  const { postid } = req.params;
  const { userID, content } = req.body;

  try {
    const post = await PostSchema.findById(postid);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      author: userID,
      content: content,
      createdAt: new Date(),
    };

    post.comments.push(newComment);

    await post.save();

    // Now 'post' object has 'comments' populated with 'author' details
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment to post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const bookmark = async (req, res) => {
     const { postid, userid } = req.body;
   
     try {
       // Find the user by userid
       const user = await User.findById(userid);
   
       if (!user) {
         return res.status(404).json({ error: 'User not found' });
       }
 
         // If not bookmarked, add the postid to bookmarks array (avoid duplicates)
         await User.findByIdAndUpdate(userid, { $addToSet: { bookmarks: postid } });
       
   
       // Fetch the updated user after the toggle operation
       const updatedUser = await User.findById(userid);
   
       // Respond with the updated user object
       res.json(updatedUser);
     } catch (error) {
       console.error('Error toggling bookmark:', error);
       res.status(500).json({ error: 'Server error' });
     }
   };
   
   
   

module.exports = { Post, getpost, likes, getallposts, getpostbyId, comment,bookmark };
