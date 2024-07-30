const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json("firm not found");
        }
        const product = new Product({
            productName, price, category, bestSeller, description, image, firm: firm._id
        })
        const savedProducts = await product.save();
        firm.products.push(savedProducts);
        await firm.save();

        res.status(201).json(savedProducts)
        

    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error");
    }
}

const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json("firm not found");
        }
        const products = await Product.find({ firm: firmId });
        const restaurantName = firm.firmName;
        res.status(200).json({ restaurantName, products })
    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error");
    }
}

const deleteProductById = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json('product not found')
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error");
    }
}



module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm ,deleteProductById};