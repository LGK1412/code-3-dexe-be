const productModel = require('../models/product')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid') // dùng để tránh trùng tên file

exports.getAllProduct = async () => {
    const allProduct = await productModel.find().populate('category', 'name').populate('style', 'name');
    return { success: true, data: allProduct }
}

exports.getAllProductNotHide = async () => {
    const allProductNotHide = await productModel.find({ isHide: false })
    return { success: true, data: allProductNotHide }
}

exports.getProductById = async (id) => {
    const product = await productModel.findById(id).populate('category', 'name').populate('style', 'name');
    return { success: true, data: product }
}

exports.addProduct = async (name, description, menh_good, menh_bad, huong_good, huong_bad, color_good, color_bad, files, isHide, quantity, inStock, price, menh_main, color_main, category, shortDescription, style) => {
    const modelFile = files.model?.[0]
    const imageFiles = files.images || []

    menh_good = JSON.parse(menh_good || '[]')
    menh_bad = JSON.parse(menh_bad || '[]')
    huong_good = JSON.parse(huong_good || '[]')
    huong_bad = JSON.parse(huong_bad || '[]')
    color_good = JSON.parse(color_good || '[]')
    color_bad = JSON.parse(color_bad || '[]')
    description = JSON.parse(description || '[]')

    // check tồn tại
    const existing = await productModel.findOne({
        $or: [
            { name: name },
            { model_name: modelFile?.originalname },
        ]
    })

    if (existing) {
        return { success: false, message: "Product đã tồn tại hoặc model đã tồn tại!" }
    }

    // Tạo product trước, chưa có file
    const newProduct = new productModel({
        name,
        model_name: modelFile?.originalname || '',
        description: description,
        menh_good,
        menh_bad,
        huong_good,
        huong_bad,
        color_good,
        color_bad,
        image_url: [],
        isHide,
        quantity,
        inStock,
        price,
        menh_main,
        color_main,
        category,
        shortDescription,
        style
    })
    // console.log(newProduct)
    await newProduct.save()

    // lưu model file nếu có
    if (modelFile) {
        const ext = path.extname(modelFile.originalname)
        const modelName = `${newProduct._id}_${Date.now()}${ext}`
        const modelPath = path.join(__dirname, '../assets/models/', modelName)
        fs.writeFileSync(modelPath, modelFile.buffer)
        newProduct.model_name = modelName
    }

    // lưu ảnh nếu có
    const savedImages = []
    for (let img of imageFiles) {
        const ext = path.extname(img.originalname)
        const imgName = `${newProduct._id}_${uuidv4()}${ext}`
        const imgPath = path.join(__dirname, '../assets/productImages/', imgName)
        fs.writeFileSync(imgPath, img.buffer)
        savedImages.push(imgName)
    }

    newProduct.image_url = savedImages

    // update lại bản ghi đã tạo
    await newProduct.save()

    return { success: true, product: newProduct }
}

exports.updateProduct = async (id, name, description, menh_good, menh_bad, huong_good, huong_bad, color_good, color_bad, files, isHide, quantity, inStock, price, menh_main, color_main, category, shortDescription, style) => {
    const modelFile = files.model?.[0]
    const imageFiles = files.images || []

    menh_good = JSON.parse(menh_good || '[]')
    menh_bad = JSON.parse(menh_bad || '[]')
    huong_good = JSON.parse(huong_good || '[]')
    huong_bad = JSON.parse(huong_bad || '[]')
    color_good = JSON.parse(color_good || '[]')
    color_bad = JSON.parse(color_bad || '[]')
    description = JSON.parse(description || '[]')

    const product = await productModel.findById(id)
    if (!product) return { success: false, message: "Không tìm thấy sản phẩm!" }

    // Xoá model cũ nếu có và có model mới
    if (modelFile && product.model_path) {
        const oldModelPath = path.join(__dirname, '../assets/models/', product.model_path)
        if (fs.existsSync(oldModelPath)) fs.unlinkSync(oldModelPath)
    }

    // Xoá ảnh cũ nếu có ảnh mới
    if (imageFiles.length > 0 && product.image_url.length > 0) {
        for (let imgPath of product.image_url) {
            const fullPath = path.join(__dirname, '../assets/productImages/', imgPath)
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
        }
    }

    // Gán lại thông tin mới
    product.name = name
    product.description = description
    product.menh_good = menh_good
    product.menh_bad = menh_bad
    product.huong_good = huong_good
    product.huong_bad = huong_bad
    product.color_good = color_good
    product.color_bad = color_bad
    product.isHide = isHide
    product.quantity = quantity
    product.inStock = inStock
    product.price = price
    product.menh_main = menh_main
    product.color_main = color_main
    product.category = category
    product.shortDescription = shortDescription
    product.style = style

    // Lưu model mới nếu có
    if (modelFile) {
        const ext = path.extname(modelFile.originalname)
        const modelName = `${product._id}_${Date.now()}${ext}`
        const modelPath = path.join(__dirname, '../assets/models/', modelName)
        fs.writeFileSync(modelPath, modelFile.buffer)
        product.model_name = modelFile.originalname
        product.model_path = modelName
    }

    // Lưu ảnh mới nếu có
    const savedImages = []
    for (let img of imageFiles) {
        const ext = path.extname(img.originalname)
        const imgName = `${product._id}_${uuidv4()}${ext}`
        const imgPath = path.join(__dirname, '../assets/productImages/', imgName)
        fs.writeFileSync(imgPath, img.buffer)
        savedImages.push(imgName)
    }

    if (savedImages.length > 0) product.image_url = savedImages

    await product.save()

    return { success: true, product }
}

exports.deleteProduct = async (id) => {
    const product = await productModel.findById(id)
    if (!product) {
        return { success: false, message: "Product không tồn tại!" }
    }

    const modelDir = path.join(__dirname, '../assets/models')
    const imgDir = path.join(__dirname, '../assets/productImages')

    // Xoá model
    const modelFiles = fs.existsSync(modelDir) ? fs.readdirSync(modelDir) : []
    modelFiles.forEach(file => {
        if (file.includes(product._id)) {
            const fullPath = path.join(modelDir, file)
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
        }
    })

    // Xoá ảnh
    const imgFiles = fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : []
    imgFiles.forEach(file => {
        if (file.includes(product._id)) {
            const fullPath = path.join(imgDir, file)
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
        }
    })

    // Xoá DB
    await productModel.findByIdAndDelete(id)

    return { success: true }
}

exports.getBestSellerProduct = async () => {
    const products = await productModel.find({
        inStock: true,
        isHide: false,
    })
        .sort({ sellQuantity: -1 }) // -1 = giảm dần
        .limit(10); // lấy top 10

    if (products.length === 0) {
        return { success: false, message: "Không tìm thấy sản phẩm bestseller!" };
    }

    return { success: true, data: products };
};

exports.getAllProductForPhongThuy = async (userMenh) => {
    const allProducts = await productModel.find({ isHide: false });

    if (!userMenh) {
        // Nếu không có menh, trả toàn bộ sort theo sellQuantity
        const sortedAll = allProducts.sort((a, b) => b.sellQuantity - a.sellQuantity);
        return { success: true, data: sortedAll };
    }
    
    const menhRelation = {
        'Kim': ['Thổ', 'Kim'],
        'Mộc': ['Thủy', 'Mộc'],
        'Thủy': ['Kim', 'Thủy'],
        'Hỏa': ['Mộc', 'Hỏa'],
        'Thổ': ['Hỏa', 'Thổ']
    };

    const bestMenhList = menhRelation[userMenh] || [];

    // Nhóm best theo menh
    const bestProducts = allProducts
        .filter(p => bestMenhList.includes(p.menh_main))
        .sort((a, b) => b.sellQuantity - a.sellQuantity)
        .slice(0, 20);
    
    // Sản phẩm còn lại không thuộc best
    const remainingProducts = allProducts
        .filter(p => !bestProducts.includes(p))
        .sort((a, b) => b.sellQuantity - a.sellQuantity);
    
    const result = [...bestProducts, ...remainingProducts];

    return { success: true, data: result };
};

