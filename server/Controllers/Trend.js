
const Post = require('../models/PostSchema'); // Import your Post model defined in PostModel.js

const getTrendingHashtags = async (req, res) => {
  try {
    const trendingHashtags = await Post.aggregate([
      {
        $match: { Caption: { $regex: /^#/ } }
      },
      {
        $project: {
          hashtags: {
            $split: ['$Caption', ' ']
          }
        }
      },
      {
        $unwind: '$hashtags' 
      },
      {
        $match: { 'hashtags': { $regex: /^#/ } }
      },
      {
        $group: {
          _id: '$hashtags', 
          count: { $sum: 1 } 
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Extract only the hashtag names from the result
    const sortedTrendingHashtags = trendingHashtags.map((item) => item._id);

    res.status(200).json({ trendingHashtags: sortedTrendingHashtags });
  } catch (error) {
    console.error('Error fetching trending hashtags:', error);
    res.status(500).json({ error: 'Failed to fetch trending hashtags' });
  }
};

module.exports = { getTrendingHashtags };
