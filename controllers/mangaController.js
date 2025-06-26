const mangaService = require('../services/mangaService')

exports.addNewManga = async (req, res) => {
    const { name, description, categories } = req.body
    const author = req.user.userId
    // console.log(name + " " + description + " " + categories)
    // console.log(req.user.userId)
    const image = req.file.filename
    try {
        const result = await mangaService.addNewManga(name, description, categories, author, image)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.getAllManga = async (req, res) => {
    try {
        const result = await mangaService.getAllManga()

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, mangas: result.mangas, message: "Lấy truyện thành công!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.getMangaByAuthorId = async (req, res) => {
    const { userId } = req.params
    try {
        const result = await mangaService.getMangaByAuthorId(userId)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, mangas: result.mangas, message: "Lấy truyện thành công!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.getMangaById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await mangaService.getMangaById(id)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, manga: result.manga, message: "Lấy truyện thành công!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.updateManga = async (req, res) => {
    const { id } = req.params
    const { name, description, categories } = req.body
    const image = req.file?.filename
    try {
        const result = await mangaService.updateManga(id, name, description, categories, image)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.deleteManga = async (req, res) => {
    const { id } = req.params
    try {
        const result = await mangaService.deleteManga(id)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}