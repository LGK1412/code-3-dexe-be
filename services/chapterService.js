const chapterModel = require('../models/chapter.model')

exports.addChapter = async (name, image, mangaId) => {
    const newChapter = new chapterModel({
        name,
        image,
        mangaId
    })

    const result = await newChapter.save()

    if (result) {
        return {
            success: true,
            message: "Tạo chapter mới thành công!",
        }
    } else {
        return {
            success: false,
            message: "Tạo chapter mới thất bại",
        }
    }
}

exports.getChapterByMangaId = async (mangaId) => {
    const chapters = await chapterModel.find({ mangaId: mangaId, isDelete: false}).sort({ createdAt: 1 })
    if (chapters) {
        return {
            success: true,
            message: "Lấy các chapter thành công!",
            chapters: chapters
        }
    } else {
        return {
            success: false,
            message: "Lấy các chapter thất bại",
        }
    }
}

exports.getChapterById = async (chapterId) => {
    const chapter = await chapterModel.findOne({ _id: chapterId, isDelete: false })

    if (chapter) {
        return {
            success: true,
            message: "Lấy chapter thành công!",
            chapter: chapter
        }
    } else {
        return {
            success: false,
            message: "Lấy chapter thất bại",
        }
    }
}

exports.updateChapter = async (chapterId, name) => {
    const chapter = await chapterModel.findByIdAndUpdate(
        chapterId,
        { $set: { name } },
        { new: true }
    )

    if (chapter) {
        return {
            success: true,
            message: "Cập nhật chapter thành công!"
        }
    } else {
        return {
            success: false,
            message: "Cập nhật chapter thất bại",
        }
    }
}

exports.deleteChapter = async (chapterId) => {
    const chapter = await chapterModel.findByIdAndUpdate(
        chapterId,
        { $set: { isDelete: true } },
        { new: true }
    )

    if (chapter) {
        return {
            success: true,
            message: "Xoá chapter thành công!"
        }
    } else {
        return {
            success: false,
            message: "Xoá chapter thất bại",
        }
    }
}