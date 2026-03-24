import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);

        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient quantity for product: ${product.name}`);
        }

        return {
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = new Order({
      buyer: req.user.id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    const created = await order.save();
    res.status(201).json(created);
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(400).json({ message: error.message || "Invalid order data" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("items.product", "name");
    res.json(orders);
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("items.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.buyer._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const status = req.body.status;
    if (!status) return res.status(400).json({ message: "Status is required" });

    order.status = status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.buyer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "cancelled";
    const cancelled = await order.save();
    res.json(cancelled);
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
