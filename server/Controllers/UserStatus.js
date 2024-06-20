const mongoose=require('mongoose')
const User = require('../models/User');

// Follow a user
const follow = async (req, res) => {
     const { profileId } = req.params;
     const { userID } = req.body;
   
     try {
       const profile = await User.findOne({ _id: profileId });
   
       if (!profile) {
         return res.status(404).send({ message: 'Profile not found' });
       }
   
       // Check if the user is already following the profile
       const isFollowing = profile.followers.includes(userID);
   
       if (isFollowing) {
         // User is already following the profile, unfollow
         await User.updateOne(
           { _id: profileId },
           { $pull: { followers: userID } },
           { new: true }
         );
   
         await User.updateOne(
           { _id: userID },
           { $pull: { following: profileId } },
           { new: true }
         );
   
         res.send({ message: 'Unfollowed successfully' });
       } else {
         // User is not following the profile, follow
         await User.updateOne(
           { _id: profileId },
           { $addToSet: { followers: userID } },
           { new: true }
         );
   
         await User.updateOne(
           { _id: userID },
           { $addToSet: { following: profileId } },
           { new: true }
         );
   
         res.send({ message: 'Followed successfully' });
       }
     } catch (error) {
       console.log(error);
       res.status(500).send({ message: 'Server Error' });
     }
   };
   



   const findFollowers = async (req, res) => {
     const { profileId } = req.params;
     const { userID } = req.query; // Access userID from query parameters
   
     try {
       const follower = await User.findById(profileId);
       if (!follower) {
         return res.status(404).send("Profile user not found");
       }
   
       const isFollowing = follower.followers.includes(userID);
   
       if (isFollowing) {
         return res.send({ isFollowing: true, follower });
       } else {
         return res.status(404).send("User is not following this profile");
       }
     } catch (error) {
       console.log(error);
       return res.status(500).send("Internal Server Error");
     }
   };

module.exports = {follow,findFollowers};
