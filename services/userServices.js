const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const notificationEmitter = require("../events/notification.events");

exports.updateUserProfile = async (userId, name, gender, dob, role) => {
  try {
    if (!name) return { success: false, message: "Thiếu trường: họ tên" };
    if (!gender) return { success: false, message: "Thiếu trường: giới tính" };
    if (!dob) return { success: false, message: "Thiếu trường: ngày sinh" };
    if (!role) return { success: false, message: "Thiếu trường: role" };
    // Kiểm tra trùng tên (ngoại trừ user hiện tại)
    const existingName = await User.findOne({
      name,
      _id: { $ne: userId },
    });
    if (existingName) {
      return {
        success: false,
        message: "Tên này đã được sử dụng, vui lòng chọn tên khác",
      };
    }
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, gender, dob, role },
      { new: true }
    );
    if (!updated)
      return { success: false, message: "Không tìm thấy người dùng" };

    const token = jwt.sign(
      {
        userId: updated._id,
        email: updated.email,
        verified: updated.verified,
        name: updated.name,
        gender: updated.gender,
        dob: updated.dob,
        avatar: updated.avatar,
        role: updated.role,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "180d" }
    );

    updated.loginToken = token;
    await updated.save();

    return { success: true, message: "Cập nhật hồ sơ thành công", token };
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err.message);
    return {
      success: false,
      message: "Đã xảy ra lỗi trong quá trình cập nhật",
    };
  }
};

exports.toggleFollow = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("Không thể follow chính mình.");
  }

  const follower = await User.findById(followerId);
  const following = await User.findById(followingId);
  if (!follower || !following) throw new Error("Người dùng không tồn tại.");

  const isFollowing = follower.following.includes(followingId);

  if (isFollowing) {
    // Unfollow
    follower.following.pull(followingId);
    following.followers.pull(followerId);
  } else {
    // Follow
    follower.following.push(followingId);
    following.followers.push(followerId);

    // Gửi thông báo nếu không phải tự follow
    notificationEmitter.emit("userFollowed", {
      senderId: followerId,
      receiverId: followingId,
    });
  }

  await follower.save();
  await following.save();

  return { success: true, isFollowing: !isFollowing };
};

exports.getFollowers = async (userId) => {
  const user = await User.findById(userId).populate(
    "followers",
    "name avatar role"
  );
  if (!user) throw new Error("Người dùng không tồn tại");
  return user.followers;
};

exports.getFollowing = async (userId) => {
  const user = await User.findById(userId).populate(
    "following",
    "name avatar role"
  );
  if (!user) throw new Error("Người dùng không tồn tại");
  return user.following;
};

exports.getFollowStats = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Người dùng không tồn tại");

  return {
    followersCount: user.followers.length,
    followingCount: user.following.length,
  };
};
