const { Types } = require("mongoose");
const categoryModel = require("../models/category.model");
const mangaModel = require("../models/manga.model");

exports.getAllCategory = async () => {
  try {
    const categories = await categoryModel.find().lean();
    return {
      success: true,
      categories,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to retrieve categories",
    };
  }
};

exports.getCategoryNameById = async (categoryId) => {
  if (!Types.ObjectId.isValid(categoryId)) {
    return {
      success: false,
      message: "Invalid category ID",
    };
  }
  try {
    const category = await categoryModel
      .findById(categoryId)
      .select("name")
      .lean();
    if (!category) {
      return {
        success: false,
        message: "Category not found",
      };
    }
    return {
      success: true,
      category,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to retrieve category",
    };
  }
};

exports.getAllMangaByCategory = async (categoryId) => {
  if (!Types.ObjectId.isValid(categoryId)) {
    return {
      success: false,
      message: "Invalid category ID",
    };
  }
  try {
    // Fetch manga with the specified category
    const mangas = await mangaModel
      .find({
        categories: categoryId,
        isDelete: false,
      })
      .lean();

    if (!mangas.length) {
      return {
        success: true,
        mangas: [],
      };
    }

    // Get all unique category IDs from the mangas
    const categoryIds = [
      ...new Set(mangas.flatMap((manga) => manga.categories.map(String))),
    ];

    // Fetch all categories in one query
    const categories = await categoryModel.find({ _id: { $in: categoryIds } });
    // Create a category map for quick lookup
    const categoryMap = categories.reduce((map, cat) => {
      map[cat._id.toString()] = cat;
      return map;
    }, {});

    // Map mangas with their category details
    const mangasWithCategories = mangas.map((manga) => ({
      ...manga,
      categories: manga.categories
        .map((catId) => categoryMap[catId.toString()])
        .filter((cat) => cat), // Remove undefined categories
    }));

    return {
      success: true,
      mangas: mangasWithCategories,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to retrieve manga by category",
    };
  }
};
