const userService = require('../services/userServices')

exports.updateUserProfile = async (req, res) => {
    const { userId } = req.params
    const { name, gender, dob, role} = req.body

    try {
        const result = await userService.updateUserProfile(userId, name, gender, dob, role)
        
        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: result.message, result })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi kết nối server' })
    }
}

exports.toggleFavouriteManga = async (req, res) => {
  const { userId } = req.params
  const { mangaId } = req.body

  try {
    const result = await userService.toggleFavouriteManga(userId, mangaId)
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message })
    }
    return res.status(200).json({ success: true, message: result.message, favourites: result.favourites })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Lỗi server' })
  }
}

exports.toggleFollowAuthor = async (req, res) => {
  const { userId } = req.params
  const { authorId } = req.body

  try {
    const result = await userService.toggleFollowAuthor(userId, authorId)
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message })
    }
    return res.status(200).json({ success: true, message: result.message, folowAuthors: result.folowAuthors })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Lỗi server' })
  }
}