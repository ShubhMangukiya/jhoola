const {
  Order,
  OrderItem,
  Cart,
  Product,
  ProductImage,
  Sequelize,
  sequelize,
} = require("../model");
const createOrder = async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body);

    const {
      userId,
      shippingCharge,
      tax,
      totalPrice,
      grandTotal,
      paymentMethod,
      formData,
      status,
      orderItems,
    } = req.body;

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      apt,
      city,
      state,
      postalCode,
    } = formData || {};
    console.log("Final Extracted Data:", { firstName, email, phone, address });
    if (
      !userId ||
      !tax ||
      !totalPrice ||
      !paymentMethod ||
      !phone ||
      !email ||
      !status
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const order = await Order.create({
      userId,
      shippingCharge,
      tax,
      totalPrice,
      grandTotal,
      paymentMethod,
      firstName,
      lastName,
      email,
      phone,
      address,
      apt,
      city,
      state,
      postalCode,
      status,
      razorpay_order_id: req.body.razorpay_order_id || null, // Add Razorpay fields
      razorpay_payment_id: req.body.razorpay_payment_id || null,
      razorpay_signature: req.body.razorpay_signature || null,
      paymentStatus: req.body.paymentStatus || "Pending", // Add paymentStatus
    });
    const createdOrderItems = await Promise.all(
      orderItems?.map(async (item) => {
        console.log("Creating Order Item:", item);
        return await OrderItem.create({
          orderId: order.orderId,
          productId: item.productId,
          quantity: item.quantity,
          // size: item.size,
          price: item.price,
          totalAmount: item.quantity * item.price,
        });
      })
    );
    await Cart.destroy({ where: { userId } });

    return res.status(201).json({
      message: "Order placed successfully!",
      order,
      orderItems: createdOrderItems,
    });
  } catch (error) {
    console.log("Error in Order Creation:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  attributes: ["imageUrl"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Process images into array
    const processedOrder = {
      ...order.toJSON(),
      OrderItems: order.OrderItems?.map((item) => ({
        ...item.toJSON(),
        Product: {
          ...item.Product.toJSON(),
          images: item.Product.Images.map((img) => img.imageUrl),
        },
      })),
    };

    res.status(200).json(processedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  attributes: ["imageUrl"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Process images for all orders
    const processedOrders = orders?.map((order) => ({
      ...order.toJSON(),
      OrderItems: order.OrderItems?.map((item) => ({
        ...item.toJSON(),
        Product: {
          ...item.Product.toJSON(),
          images: item.Product.Images.map((img) => img.imageUrl),
        },
      })),
    }));
    return res.status(200).json(processedOrders);
  } catch (error) {
    console.log("Error fetching orders:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  attributes: ["imageUrl"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Process images for user orders
    const processedOrders = orders?.map((order) => ({
      ...order.toJSON(),
      OrderItems: order.OrderItems?.map((item) => ({
        ...item.toJSON(),
        Product: {
          ...item.Product.toJSON(),
          images: item.Product.Images.map((img) => img.imageUrl),
        },
      })),
    }));

    return res.status(200).json(processedOrders);
  } catch (error) {
    console.log("Error fetching user orders:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  console.log("body", req.body);

  try {
    await Order.update({ status }, { where: { orderId } });
    const updatedOrder = await Order.findOne({
      where: { orderId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [{ model: ProductImage }],
            },
          ],
        },
      ],
    });

    res.status(200).send({
      message: "Order Status Updated Successfully",
      order: updatedOrder,
    });
    console.log("updatedOrder", orderId, updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating order status" });
  }
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.destroy({ where: { orderId } });
    res.status(200).json({ message: "Order deleted successfully" });
    console.log("order deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete order", error });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 1) {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled." });
    }

    order.status = 5;
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// const getOrderAnalytics = async (req, res) => {
//   try {
//     const totalSalesResult = await Order.findOne({
//       attributes: [
//         [Sequelize.fn("SUM", Sequelize.col("grandTotal")), "totalSales"],
//         [Sequelize.fn("COUNT", Sequelize.col("orderId")), "totalOrders"],
//       ],
//       raw: true,
//     });

//     const monthlyTrend = await Order.findAll({
//       attributes: [
//         [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
//         [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
//         [Sequelize.fn("SUM", Sequelize.col("grandTotal")), "totalSales"],
//         [Sequelize.fn("COUNT", Sequelize.col("orderId")), "orderCount"],
//       ],
//       group: ["year", "month"],
//       order: [
//         ["year", "ASC"],
//         ["month", "ASC"],
//       ],
//       raw: true,
//     });

//     const statusDistribution = await Order.findAll({
//       attributes: [
//         "status",
//         [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
//       ],
//       group: ["status"],
//       raw: true,
//     });

//     const topProducts = await OrderItem.findAll({
//       attributes: [
//         "productId",
//         [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"],
//         [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
//       ],
//       include: [
//         {
//           model: Product,
//           attributes: ["name"],
//           include: [
//             {
//               model: Image,
//               attributes: ["imageUrl"],
//             },
//           ],
//         },
//       ],
//       group: ["productId"],
//       order: [[Sequelize.literal("totalSold"), "DESC"]],
//       limit: 5,
//     });

//     console.log("topproducts",topProducts);

//     const analyticsData = {
//       totalSales: totalSalesResult.totalSales || 0,
//       totalOrders: totalSalesResult.totalOrders || 0,
//       monthlyTrend: monthlyTrend?.map((month) => ({
//         year: month.year,
//         month: month.month,
//         totalSales: month.totalSales,
//         orderCount: month.orderCount,
//       })),
//       statusDistribution: statusDistribution.map((status) => ({
//         status: status.status,
//         count: status.count,
//       })),
//       topProducts: topProducts.map((product) => ({
//         productId: product.productId,
//         name: product.product.name,
//         image: product.product.images[0]?.imageUrl || null,
//         totalSold: product.totalSold,
//         totalRevenue: product.totalRevenue,
//       })),
//     };

//     res.status(200).json(analyticsData);
//   } catch (error) {
//     console.error("Analytics Error:", error);
//     res.status(500).json({
//       error: "Analytics fetch failed",
//       details: error.message,
//     });
//   }
// };

// const getOrderAnalytics = async (req, res) => {
//   try {
//     const totalSalesResult = await Order.findOne({
//       attributes: [
//         [Sequelize.fn("SUM", Sequelize.col("grandTotal")), "totalSales"],
//         [Sequelize.fn("COUNT", Sequelize.col("orderId")), "totalOrders"],
//       ],
//       raw: true,
//     });

//     const monthlyTrend = await Order.findAll({
//       attributes: [
//         [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
//         [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
//         [Sequelize.fn("SUM", Sequelize.col("grandTotal")), "totalSales"],
//         [Sequelize.fn("COUNT", Sequelize.col("orderId")), "orderCount"],
//       ],
//       group: ["year", "month"],
//       order: [
//         ["year", "ASC"],
//         ["month", "ASC"],
//       ],
//       raw: true,
//     });

//     const statusDistribution = await Order.findAll({
//       attributes: [
//         "status",
//         [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
//       ],
//       group: ["status"],
//       raw: true,
//     });

//     const topProducts = await OrderItem.findAll({
//       attributes: [
//         "productId",
//         [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"],
//         [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
//       ],
//       include: [
//         {
//           model: Product,
//           attributes: ["name"],
//           include: [
//             {
//               model: Image,
//               attributes: ["imageUrl"],
//             },
//           ],
//         },
//       ],
//       group: ["productId"],
//       order: [[Sequelize.literal("totalSold"), "DESC"]],
//       limit: 5,
//     });

//     const analyticsData = {
//       totalSales: totalSalesResult?.totalSales || 0,
//       totalOrders: totalSalesResult?.totalOrders || 0,
//       monthlyTrend: monthlyTrend?.map((month) => ({
//         year: month.year,
//         month: month.month,
//         totalSales: month.totalSales,
//         orderCount: month.orderCount,
//       })) || [],
//       statusDistribution: statusDistribution?.map((status) => ({
//         status: status.status,
//         count: status.count,
//       })) || [],
//       topProducts: topProducts?.map((product) => ({
//         productId: product.productId,
//         name: product.product?.name || "N/A",
//         image: product.product?.images?.[0]?.imageUrl || null,
//         totalSold: product.totalSold,
//         totalRevenue: product.totalRevenue,
//       })) || [],
//     };

//     res.status(200).json(analyticsData);
//   } catch (error) {
//     console.error("Analytics Error:", error);
//     res.status(500).json({
//       error: "Analytics fetch failed",
//       details: error.message,
//     });
//   }
// };

const getOrderAnalytics = async (req, res) => {
  try {
    // Get Total Sales and Orders (General)
    const totalSalesResult = await Order.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("grandTotal")), "totalSales"],
        [Sequelize.fn("COUNT", Sequelize.col("orderId")), "totalOrders"],
      ],
      raw: true,
    });

    // Get Monthly Trend Data
    const monthlyTrend = await Order.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("grandTotal")), "totalSales"],
        [Sequelize.fn("COUNT", Sequelize.col("orderId")), "orderCount"],
      ],
      group: ["year", "month"],
      order: [
        ["year", "ASC"],
        ["month", "ASC"],
      ],
      raw: true,
    });

    // Get Order Status Distribution
    const statusDistribution = await Order.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Get Top Products (Best Selling Products)
    const topProducts = await OrderItem.findAll({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"],
        [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
      ],
      include: [
        {
          model: Product,
          attributes: ["name"],
          include: [
            {
              model: Image,
              attributes: ["imageUrl"],
            },
          ],
        },
      ],
      group: ["productId"],
      order: [[Sequelize.literal("totalSold"), "DESC"]],
      limit: 5,
      row: false,
    });

    // Check if you want data for a particular product (e.g., productId = 123)
    const productId = req.query.productId; // Pass productId in the query string
    let productAnalytics = null;

    if (productId) {
      const productData = await OrderItem.findOne({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"],
          [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
        ],
        where: { productId },
        raw: true,
      });

      productAnalytics = {
        productId,
        totalSold: productData?.totalSold || 0,
        totalRevenue: productData?.totalRevenue || 0,
      };
    }

    // Prepare the response data
    const analyticsData = {
      totalSales: totalSalesResult?.totalSales || 0,
      totalOrders: totalSalesResult?.totalOrders || 0,
      monthlyTrend:
        monthlyTrend?.map((month) => ({
          year: month.year,
          month: month.month,
          totalSales: month.totalSales,
          orderCount: month.orderCount,
        })) || [],
      statusDistribution:
        statusDistribution?.map((status) => ({
          status: status.status,
          count: status.count,
        })) || [],
      topProducts:
        topProducts?.map((product) => ({
          productId: product.productId,
          name: product.product?.name || "N/A",
          image: product.product?.images?.[0]?.imageUrl || null,
          totalSold: Number(product.get("totalSold")), // <- extract from aggregated field
          totalRevenue: Number(product.get("totalRevenue")),
        })) || [],
      productAnalytics, // Include product analytics if available
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      error: "Analytics fetch failed",
      details: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  getOrderAnalytics,
};
