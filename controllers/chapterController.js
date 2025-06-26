const chapterService = require('../services/chapterService')

exports.addNewChapter = async (req, res) => {
    const { name } = req.body
    const { mangaId } = req.params
    const image = req.files.map(file => file.filename)

    try {
        const result = await chapterService.addChapter(name, image, mangaId)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.getChapterByMangaId = async (req, res) => {
    const { mangaId } = req.params

    try {
        const result = await chapterService.getChapterByMangaId(mangaId)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message, chapters: result.chapters })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.getChapterById = async (req, res) => {
    const { chapterId } = req.params

    try {
        const result = await chapterService.getChapterById(chapterId)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message, chapter: result.chapter })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.updateChapter = async (req, res) => {
    const { chapterId } = req.params
    const { name } = req.body
    try {
        const result = await chapterService.updateChapter(chapterId, name)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.deleteChapter = async (req, res) => {
    const { chapterId } = req.params

    try {
        const result = await chapterService.deleteChapter(chapterId)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}