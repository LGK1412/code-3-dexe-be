const mangaModel = require('../models/manga.model')
const fs = require("fs")
const path = require("path")

exports.addNewManga = async (name, description, categories, author, image) => {
    const newManga = new mangaModel({
        name,
        description,
        categories,
        author,
        image
    })

    const result = await newManga.save()
    // console.log("resule tạo manga:")
    // console.log(result)

    if (result) {
        return {
            success: true,
            message: "Tạo truyện mới thành công!",
        }
    } else {
        return {
            success: false,
            message: "Tạo truyện mới thất bại",
        }
    }
}

exports.getAllManga = async () => {
    const mangas = await mangaModel.find({ isDelete: false }).sort({ createdAt: -1 });

    if (!mangas) {
        return { success: false, message: "Lỗi không lấy được truyện!" }
    }

    return { success: true, mangas: mangas }
}

exports.getMangaByAuthorId = async (userId) => {
    const mangas = await mangaModel.find({ author: userId, isDelete: false }).sort({ createdAt: -1 });

    if (!mangas) {
        return { success: false, message: "Lỗi không lấy được truyện!" }
    }

    return { success: true, mangas: mangas }
}

exports.getMangaById = async (id) => {
    const manga = await mangaModel.findOne({ _id: id, isDelete: false });

    if (!manga) {
        return { success: false, message: "Lỗi không lấy được truyện!" }
    }

    return { success: true, manga: manga }
}

exports.updateManga = async (id, name, description, categories, image) => {
    try {
        const existingManga = await mangaModel.findOne({ _id: id, isDelete: false });

        if (!existingManga) {
            return { success: false, message: "Không tìm thấy truyện" }
        }

        // Nếu có ảnh mới → xóa ảnh cũ
        if (image && existingManga.image) {
            const oldImagePath = path.join(__dirname, "../assets/thumbnailsManga/", existingManga.image)
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath) // xóa ảnh cũ
            }
            existingManga.image = image // gán ảnh mới
        }

        // Cập nhật thông tin khác
        existingManga.name = name || existingManga.name
        existingManga.description = description || existingManga.description
        existingManga.categories = categories || existingManga.categories

        await existingManga.save()

        return { success: true, message: "Cập nhật truyện thành công!" }
    } catch (err) {
        console.error("Lỗi khi cập nhật manga:", err)
        return { success: false, message: "Có lỗi xảy ra khi cập nhật truyện" }
    }
}

exports.deleteManga = async (id) => {
    try {
        const existingManga = await mangaModel.findOne({ _id: id, isDelete: false });

        if (!existingManga) {
            return { success: false, message: "Không tìm thấy truyện" }
        }

        existingManga.isDelete = true

        await existingManga.save()

        return { success: true, message: "Xoá truyện thành công!" }
    } catch (err) {
        return { success: false, message: "Có lỗi xảy ra khi xoá truyện" }
    }
}