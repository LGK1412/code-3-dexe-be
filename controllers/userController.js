const userService = require("../services/userServices");
const notificationEmitter = require("../events/notification.events");

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

    if (followerId.toString() !== followingId.toString() && result?.isFollowing) {
      notificationEmitter.emit("userFollowed", {
        senderId: followerId,
        receiverId: followingId,
      });
    }

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

exports.toggleFavouriteManga = async (req, res) => {
  const userId = req.params.userId;
  const { mangaId } = req.body;

  const result = await userService.toggleFavouriteManga(userId, mangaId);
  return res.status(result.success ? 200 : 400).json(result);
};

exports.toggleFollowAuthor = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { authorId } = req.body;

    const result = await userService.toggleFollowAuthor(userId, authorId);

    if (result?.success && userId !== authorId) {
      notificationEmitter.emit("userFollowed", {
        senderId: userId,
        receiverId: authorId,
      });
    }
    console.log("follow success")

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};