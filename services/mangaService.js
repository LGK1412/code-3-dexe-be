const mangaModel = require("../models/manga.model");
const categoryModel = require("../models/category.model");
const categoryService = require("../services/categoryService");
const fs = require("fs");
const path = require("path");

exports.addNewManga = async (name, description, categories, author, image) => {
  const newManga = new mangaModel({
    name,
    description,
    categories,
    author,
    image,
  });

  const result = await newManga.save();
  // console.log("resule tạo manga:")
  // console.log(result)

  if (result) {
    return {
      success: true,
      message: "Tạo truyện mới thành công!",
    };
  } else {
    return {
      success: false,
      message: "Tạo truyện mới thất bại",
    };
  }
};

exports.getAllManga = async () => {
  const mangas = await mangaModel.find({});
  if (!mangas || mangas.length === 0) {
    return { success: false, message: "Không lấy được truyện thịnh hành!" };
  }
  const mangasWithCategories = await Promise.all(
    mangas.map(async (manga) => {
      const categoryPromises = manga.categories.map(async (categoryId) => {
        const result = await categoryService.getCategoryNameById(categoryId);
        console.log(result);
        return result.success ? result.category : null;
      });
      const categories = (await Promise.all(categoryPromises)).filter(
        (cat) => cat !== null
      );

      return { ...manga._doc, categories };
    })
  );

  return { success: true, mangas: mangasWithCategories };
};

exports.getMangaByAuthorId = async (userId) => {
  const mangas = await mangaModel
    .find({ author: userId, isDelete: false })
    .sort({ createdAt: -1 });

  if (!mangas) {
    return { success: false, message: "Lỗi không lấy được truyện!" };
  }

  return { success: true, mangas: mangas };
};

exports.getMangaById = async (id) => {
  const mangas = await mangaModel.find({ _id: id, isDelete: false });
  if (!mangas || mangas.length === 0) {
    return { success: false, message: "Không lấy được truyện thịnh hành!" };
  }
  const mangasWithCategories = await Promise.all(
    mangas.map(async (manga) => {
      const categoryPromises = manga.categories.map(async (categoryId) => {
        const result = await categoryService.getCategoryNameById(categoryId);
        console.log(result);
        return result.success ? result.category : null;
      });
      const categories = (await Promise.all(categoryPromises)).filter(
        (cat) => cat !== null
      );

      return { ...manga._doc, categories };
    })
  );

  return { success: true, mangas: mangasWithCategories };
};

exports.updateManga = async (id, name, description, categories, image) => {
  try {
    const existingManga = await mangaModel.findOne({
      _id: id,
      isDelete: false,
    });

    if (!existingManga) {
      return { success: false, message: "Không tìm thấy truyện" };
    }

    // Nếu có ảnh mới → xóa ảnh cũ
    if (image && existingManga.image) {
      const oldImagePath = path.join(
        __dirname,
        "../assets/thumbnailsManga/",
        existingManga.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // xóa ảnh cũ
      }
      existingManga.image = image; // gán ảnh mới
    }

    // Cập nhật thông tin khác
    existingManga.name = name || existingManga.name;
    existingManga.description = description || existingManga.description;
    existingManga.categories = categories || existingManga.categories;

    await existingManga.save();

    return { success: true, message: "Cập nhật truyện thành công!" };
  } catch (err) {
    console.error("Lỗi khi cập nhật manga:", err);
    return { success: false, message: "Có lỗi xảy ra khi cập nhật truyện" };
  }
};

exports.deleteManga = async (id) => {
  try {
    const existingManga = await mangaModel.findOne({
      _id: id,
      isDelete: false,
    });

    if (!existingManga) {
      return { success: false, message: "Không tìm thấy truyện" };
    }

    existingManga.isDelete = true;

    await existingManga.save();

    return { success: true, message: "Xoá truyện thành công!" };
  } catch (err) {
    return { success: false, message: "Có lỗi xảy ra khi xoá truyện" };
  }
};

//của cường

exports.getAllTrendingManga = async () => {
  try {
    // Sort by numeric 'view' descending, limit to top 5
    const mangas = await mangaModel.find().sort({ view: -1 }).limit(5);

    // Map through mangas and fetch category names for each
    const mangasWithCategories = await Promise.all(
      mangas.map(async (manga) => {
        const categoryPromises = manga.categories.map(async (categoryId) => {
          const result = await categoryService.getCategoryNameById(categoryId);
          console.log(result);
          return result.success ? result.category : null;
        });
        const categories = (await Promise.all(categoryPromises)).filter(
          (cat) => cat !== null
        );

        return { ...manga._doc, categories };
      })
    );

    return { success: true, mangas: mangasWithCategories };
  } catch (err) {
    return { success: false, message: "Không lấy được truyện thịnh hành!" };
  }
};

//hết của cường
