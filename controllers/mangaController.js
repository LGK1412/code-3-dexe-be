const mangaService = require("../services/mangaService");
const categoryService = require("../services/categoryService");
const chapterService = require("../services/chapterService");
const commentService = require("../services/commentService");

exports.addNewManga = async (req, res) => {
  const { name, description, categories } = req.body;
  const author = req.user.userId;
  // console.log(name + " " + description + " " + categories)
  // console.log(req.user.userId)
  const image = req.file.filename;
  try {
    const result = await mangaService.addNewManga(
      name,
      description,
      categories,
      author,
      image
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};

exports.getAllManga = async (req, res) => {
  try {
    const result = await mangaService.getAllManga();

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      mangas: result.mangas,
      message: "Lấy truyện thành công!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};

exports.getMangaByAuthorId = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await mangaService.getMangaByAuthorId(userId);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      mangas: result.mangas,
      message: "Lấy truyện thành công!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};

exports.getMangaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await mangaService.getMangaById(id);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      manga: result.mangas,
      message: "Lấy truyện thành công!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};

exports.updateManga = async (req, res) => {
  const { id } = req.params;
  const { name, description, categories } = req.body;
  const image = req.file?.filename;
  try {
    const result = await mangaService.updateManga(
      id,
      name,
      description,
      categories,
      image
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};

exports.deleteManga = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await mangaService.deleteManga(id);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};

//của cường
exports.getAllTrendingManga = async (req, res) => {
  try {
    const result = await mangaService.getAllTrendingManga();
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({
      success: true,
      trending: result.mangas,
      message: "Lấy truyện thịnh hành thành công!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};
exports.getMangaData = async (req, res) => {
  try {
    const [trendingRes, categoryRes, allRes] = await Promise.all([
      mangaService.getAllTrendingManga(),
      categoryService.getAllCategory(),
      mangaService.getAllManga(),
    ]);

    if (!trendingRes.success)
      return res
        .status(400)
        .json({ success: false, message: trendingRes.message });
    if (!categoryRes.success)
      return res
        .status(400)
        .json({ success: false, message: categoryRes.message });
    if (!allRes.success)
      return res.status(400).json({ success: false, message: allRes.message });

    return res.status(200).json({
      success: true,
      trending: trendingRes.mangas,
      categories: categoryRes.categories,
      mangas: allRes.mangas,
      message: "Lấy dữ liệu manga thành công!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server" });
  }
};

exports.getMangaDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [mangaRes, chapterRes, commentRes] = await Promise.all([
      mangaService.getMangaById(id),
      chapterService.getChapterByMangaId(id),
      commentService.getCommentByMangaById(id),
    ]);

    // if the manga lookup itself fails, we still bail out early
    if (!mangaRes.success) {
      return res
        .status(400)
        .json({ success: false, message: mangaRes.message });
    }

    // otherwise, normalize chapters and comments into arrays
    const chapters =
      chapterRes.success && Array.isArray(chapterRes.chapters)
        ? chapterRes.chapters
        : [];
    const comments =
      commentRes.success && Array.isArray(commentRes.comments)
        ? commentRes.comments
        : [];

    return res.status(200).json({
      success: true,
      data: {
        manga: mangaRes.mangas,
        chapters, // [] if none or if call failed
        comments, // [] if none or if call failed
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.rateManga = async (req, res) => {
  const { id } = req.params; // mangaId
  const { userId, value } = req.body;
  if (!userId || !value) return res.status(400).json({ success: false, message: 'Thiếu userId hoặc value' });
  try {
    const manga = await require('../models/manga.model').findById(id);
    if (!manga) return res.status(404).json({ success: false, message: 'Không tìm thấy manga' });
    // Kiểm tra user đã vote chưa (bỏ qua các rating cũ userId=null)
    const existing = manga.rating.find(r => r.userId && r.userId.toString() === userId);
    if (existing) {
      existing.value = value; // update vote
    } else {
      manga.rating.push({ userId, value });
    }
    await manga.save();
    // Tính lại trung bình và số vote
    const avg = manga.averageRating;
    const votes = manga.voteCount;
    return res.status(200).json({ success: true, averageRating: avg, voteCount: votes });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}
//hết của cường

exports.reportManga = async (req, res) => {
  const { id } = req.params; // mangaId
  const { userId, reason } = req.body;
  try {
    const manga = await require('../models/manga.model').findById(id);
    if (!manga) return res.status(404).json({ success: false, message: "Manga not found" });
    manga.reports.push({ user: userId, reason });
    await manga.save();
    res.json({ success: true, message: "Report sent!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
