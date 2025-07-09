const userService = require("../services/userServices");

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, gender, dob, role } = req.body;

  try {
    const result = await userService.updateUserProfile(
      userId,
      name,
      gender,
      dob,
      role
    );

    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
    }

    res.status(200).json({ success: true, message: result.message, result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi kết nối server" });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.id;

    const result = await userService.toggleFollow(followerId, followingId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const followers = await userService.getFollowers(req.params.id);
    res.json({ success: true, followers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const following = await userService.getFollowing(req.params.id);
    res.json({ success: true, following });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFollowStats = async (req, res) => {
  try {
    const stats = await userService.getFollowStats(req.params.id);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
