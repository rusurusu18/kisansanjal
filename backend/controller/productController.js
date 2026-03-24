import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const query = { isActive: true };
    if (req.query.category) query.category = req.query.category;

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const products = await Product.find(query).populate("farmer", "name email");
    res.json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmer", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, quantity, category, image } = req.body;

    if (!name || !description || price == null || quantity == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = new Product({
      farmer: req.user.id,
      name,
      description,
      price,
      unit: unit || "kg",
      quantity,
      category: category || "general",
      image: image || "",
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.farmer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(product, {
      name: req.body.name ?? product.name,
      description: req.body.description ?? product.description,
      price: req.body.price ?? product.price,
      unit: req.body.unit ?? product.unit,
      quantity: req.body.quantity ?? product.quantity,
      category: req.body.category ?? product.category,
      image: req.body.image ?? product.image,
      isActive: req.body.isActive ?? product.isActive,
    });

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.farmer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id });
    res.json(products);
  } catch (error) {
    console.error("Error in getMyProducts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
