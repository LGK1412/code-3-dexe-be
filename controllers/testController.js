// controllers/testController.js
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Không có file nào được tải lên.' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
  console.log(imageUrl)
  return res.status(200).json({ url: imageUrl });
};
