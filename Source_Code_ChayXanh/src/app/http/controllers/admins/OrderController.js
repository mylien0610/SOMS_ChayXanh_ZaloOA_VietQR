import {
  TableModel,
  OrderModel,
  UserModel,
  OrderDetailModel,
  ProductModel,
  CategoryModel,
  TypeOfFoodModel,
  VoucherModel,
  PointMemberModel,
} from "../../../models";
const { Sequelize } = require("sequelize");

import sendZNS from "../../../../utils/sendZns";
import getCurrentDate from "../../../../utils/getCurrentDate";

const FOLDER_NAME = "admins/pages/orders";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Đặt bàn";

class OrderController {
  // [GET] /orders
  async index(req, res) {
    try {
      const tablesActive = await TableModel.findAll({
        where: {
          storeId: req.session.store.id,
          tableStatus: "Được sử dụng",
        },
        include: [
          {
            model: OrderModel,
            as: "orders",
            where: {
              statusPay: "Chưa thanh toán",
            },
            required: false,
            include: [
              {
                model: UserModel,
                as: "user",
              },
            ],
          },
        ],
      });

      const tablesNoActive = await TableModel.findAll({
        where: {
          storeId: req.session.store.id,
          tableStatus: "Bàn trống",
        },
        include: [
          {
            model: OrderModel,
            as: "orders",
            where: {
              statusPay: "Chưa thanh toán",
            },
            required: false,
            include: [
              {
                model: UserModel,
                as: "user",
              },
            ],
          },
        ],
      });

      const usedTablesCount = tablesActive.filter(
        (table) => table.tableStatus === "Được sử dụng"
      ).length;

      res.render(`${FOLDER_NAME}/index`, {
        layout: MAIN_LAYOUT,
        title: TITLE,
        tablesActive,
        tablesNoActive,
        usedTablesCount,
        tablesCount: tablesActive.length + tablesNoActive.length,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getOrder(req, res) {
    const { orderId } = req.params;
    try {
      const order = await OrderModel.findOne({ where: { id: orderId } });

      if (!order) {
        return res.status(200).json({
          code: 1,
          message: "Không tìm thấy hóa đơn",
        });
      }

      res.status(200).json({
        code: 0,
        data: order,
        message: "Lấy hóa đơn thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async getDetail(req, res) {
    const { id } = req.params;

    try {
      const table = await TableModel.findOne({
        where: {
          id,
        },
      });
      const order = await OrderModel.findOne({
        where: { id, statusPay: "Đã thanh toán" },
        include: [
          {
            model: OrderDetailModel,
            as: "orderDetails",
            attributes: ["quantity", "price"],
            include: [
              {
                model: ProductModel,
                as: "product",
                attributes: ["id", "title", "price", "image", "description"],
              },
            ],
          },
          {
            model: TableModel,
            as: "table",
            attributes: ["id", "tableNumber", "type", "maximumNumberOfPeople"],
          },
          {
            model: VoucherModel,
            as: "voucher",
          },
        ],
      });
      res.status(200).json({
        code: 0,
        data: { order },
        message: "Lấy hóa đơn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const products = await CategoryModel.findAll({
      where: { status: 0 },
      attributes: ["id", "title"],
      include: [
        {
          model: ProductModel,
          as: "products",
          where: { status: 0 },
          attributes: ["id", "title", "price", "image", "description"],
          include: [
            {
              model: TypeOfFoodModel,
              as: "typeOfFood",
              attributes: ["id", "title"],
            },
          ],
        },
      ],
    });

    const table = await TableModel.findOne({
      where: {
        id,
      },
    });
    const order = await OrderModel.findOne({
      where: { tableId: id, statusPay: "Chưa thanh toán" },
      include: [
        {
          model: OrderDetailModel,
          as: "orderDetails",
          attributes: ["quantity", "price"],
          include: [
            {
              model: ProductModel,
              as: "product",
              attributes: ["id", "title", "price", "image", "description"],
            },
          ],
        },
        {
          model: TableModel,
          as: "table",
          attributes: ["id", "tableNumber", "type", "maximumNumberOfPeople"],
        },
      ],
    });

    res.render(`${FOLDER_NAME}/detail`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
      products,
      order,
      table,
    });
  }

  async updateOrderDetail(req, res) {
    const { orderId, productId, tableId } = req.params;
    const { type } = req.query;

    try {
      const orderDetail = await OrderDetailModel.findOne({
        where: { orderId, productId },
      });

      if (!orderDetail) {
        return res.redirect(`/admin/order/${tableId}`);
      }

      if (type === "increase") {
        orderDetail.quantity += 1;
        await orderDetail.save();
      } else if (type === "decrease") {
        if (orderDetail.quantity > 1) {
          orderDetail.quantity -= 1;
          await orderDetail.save();
        } else {
          return res.redirect(`/admin/order/${tableId}`);
        }
      } else if (type === "delete") {
        await orderDetail.destroy(); // Xóa orderDetail

        // Kiểm tra số lượng orderDetail còn lại
        const orderDetails = await OrderDetailModel.findAll({
          where: { orderId },
        });

        // Nếu không còn orderDetail nào, xóa order và cập nhật trạng thái bàn
        if (orderDetails.length === 0) {
          await OrderModel.destroy({
            where: { id: orderId },
          });

          // Cập nhật trạng thái của bàn
          await TableModel.update(
            { tableStatus: "Bàn trống" }, // Cập nhật trạng thái bàn về "Bàn trống"
            { where: { id: tableId } }
          );
        }

        return res.redirect(`/admin/order/${tableId}`);
      } else {
        return res.redirect(`/admin/order/${tableId}`);
      }

      const orderDetails = await OrderDetailModel.findAll({
        where: { orderId },
      });

      const newTotalPrice = orderDetails.reduce(
        (total, detail) => total + detail.price * detail.quantity,
        0
      );

      await OrderModel.update(
        { totalPrice: newTotalPrice },
        { where: { id: orderId } }
      );

      return res.redirect(`/admin/order/${tableId}`);
    } catch (error) {
      console.error(error);
      return res.redirect(`/admin/order/${tableId}`);
    }
  }

  async addProduct(req, res) {
    const { tableId, productId } = req.params;

    try {
      // Tìm bảng để lấy tableNumber
      const table = await TableModel.findOne({
        where: { id: tableId },
      });

      // Kiểm tra xem có order nào chưa thanh toán không
      let order = await OrderModel.findOne({
        where: {
          tableId,
          statusPay: "Chưa thanh toán",
        },
      });

      // Nếu chưa có order nào, tạo mới
      if (!order) {
        order = await OrderModel.create({
          tableId,
          tableNumber: table.tableNumber, // Lưu tableNumber vào order
          totalPrice: 0,
          paymentBy: req.session.user.id,
          storeId: req.session.store.id,
        });

        // Cập nhật trạng thái của bàn sau khi tạo đơn hàng
        await TableModel.update(
          { tableStatus: "Được sử dụng" }, // Giả định rằng bạn có trường `status`
          { where: { id: tableId } }
        );
      }

      // Tìm kiếm orderDetail cho sản phẩm hiện tại
      let orderDetail = await OrderDetailModel.findOne({
        where: {
          orderId: order.id,
          productId,
        },
      });

      if (!orderDetail) {
        // Nếu chưa có orderDetail cho sản phẩm này, tạo mới
        const product = await ProductModel.findOne({
          where: { id: productId },
        });

        if (!product) {
          return res.redirect(`/admin/order/${tableId}`);
        }

        orderDetail = await OrderDetailModel.create({
          orderId: order.id,
          productId,
          quantity: 1,
          price: product.price,
        });
      } else {
        // Nếu đã có orderDetail, tăng số lượng lên 1
        orderDetail.quantity += 1;
        await orderDetail.save();
      }

      // Cập nhật lại totalPrice của order
      const orderDetails = await OrderDetailModel.findAll({
        where: { orderId: order.id },
      });

      const newTotalPrice = orderDetails.reduce(
        (total, detail) => total + detail.price * detail.quantity,
        0
      );

      await OrderModel.update(
        { totalPrice: newTotalPrice },
        { where: { id: order.id } }
      );

      // Chuyển hướng về trang chi tiết đơn hàng
      return res.redirect(`/admin/order/${tableId}`);
    } catch (error) {
      console.error(error);
      return res.redirect(`/admin/order/${tableId}`);
    }
  }

  history(req, res) {
    res.render(`${FOLDER_NAME}/history`, {
      layout: MAIN_LAYOUT,
      title: "Lịch sử hóa đơn",
    });
  }

  async historyData(req, res) {
    try {
      const orders = await OrderModel.findAll({
        where: {
          statusPay: "Đã thanh toán",
          storeId: req.session.store.id,
        },
      });

      res.status(200).json({
        code: 0,
        data: orders,
        message: "Lấy danh sách hóa đơn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async checkout(req, res) {
    const { orderId } = req.params;
    try {
      const order = await OrderModel.findOne({
        where: { id: orderId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: OrderDetailModel,
            as: "orderDetails",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: ProductModel,
                as: "product",
                attributes: ["id", "title", "price", "image", "description"],
              },
            ],
          },
          {
            model: TableModel,
            as: "table",
            attributes: ["id", "tableNumber", "type", "maximumNumberOfPeople"],
          },
          {
            model: VoucherModel,
            as: "voucher",
            attributes: ["id", "title", "voucherCode", "value"],
          },
        ],
      });

      // res.json(order);

      res.render(`${FOLDER_NAME}/checkout`, {
        layout: MAIN_LAYOUT,
        title: TITLE,
        order,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
    }
  }

  async confirmOrderPayment(req, res) {
    const { orderId } = req.params;
    const { phoneNumber, paymentMethod, exchangePoints } = req.body;
    try {
      const order = await OrderModel.findOne({
        where: { id: orderId },
        include: [{ model: VoucherModel, as: "voucher" }],
      });
      const pointMember = await PointMemberModel.findOne({
        where: {
          phoneNumber,
        },
      });
      const table = await TableModel.findOne({
        where: { id: order.tableId },
      });

      let totalPrice = order.totalPrice;
      const data = {};
      if (phoneNumber) {
        data.phoneNumber = phoneNumber;
      }

      // Nếu đã tồn tại trong tích điểm
      if (pointMember) {
        if (exchangePoints != 0) {
          data.value = 10;
        } else {
          data.value = pointMember.value + 10;
        }
        await pointMember.update(data);
      } else {
        if (phoneNumber) {
          data.value = 10;
          PointMemberModel.create(data);
        }
      }

      if (order.voucher) {
        totalPrice =
          order.totalPrice - (order.totalPrice * order.voucher.value) / 100;
      }

      // Cập nhật order
      const { id } = await order.update({
        phoneNumber,
        paymentMethod,
        totalPrice: totalPrice - exchangePoints,
        statusPay: "Đã thanh toán",
        paymentBy: req.session.user.id,
        storeId: req.session.store.id,
      });

      // Cập nhật lại trạng thái bàn
      await table.update({ tableStatus: "Bàn trống" });

      // Nếu số điện thoại thì gửi thông tin hóa đơn đến zalo qua số điện thoại
      if (phoneNumber) {
        const pointMember = await PointMemberModel.findOne({
          where: { phoneNumber },
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        });

        const tracking_id = Math.floor(Math.random() * 1e10)
          .toString()
          .padStart(10, "0");
        const dataZns = {
          phone: `84${phoneNumber.substring(1)}`,
          template_id: "384608",
          template_data: {
            order_code: id,
            order_date: getCurrentDate(),
            note: `Thông tin hóa đơn #${id}`,
            price: totalPrice - exchangePoints,
            customer_name: null,
            total_point: pointMember.value,
            customer_code: pointMember.id,
            point: 20,
          },
          tracking_id,
        };

        if (pointMember.user) {
          dataZns.template_data.customer_name = pointMember.user.fullName;
        } else {
          dataZns.template_data.customer_name = phoneNumber;
        }

        await sendZNS(dataZns);
      }

      res.status(200).json({
        code: 0,
        message: "Thanh toán thành công",
        tableNumber: table.tableNumber,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
    }
  }

  async addVoucher(req, res) {
    const { voucherId, orderId } = req.params;
    try {
      const voucher = await VoucherModel.findOne({
        where: { id: voucherId },
      });
      const order = await OrderModel.findOne({
        where: {
          id: orderId,
        },
      });

      voucher.update({
        quantity: voucher.quantity - 1,
      });
      await order.update({ voucherId: voucherId });
      const salePrice = (order.totalPrice * voucher.value) / 100;

      res.status(200).json({
        code: 0,
        message: "Thêm mã giảm giá thành công",
        salePrice,
        totalPrice: order.totalPrice,
        voucher,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
    }
  }

  async removeVoucher(req, res) {
    const { orderId } = req.params;
    try {
      const order = await OrderModel.findOne({ where: { id: orderId } });
      const voucher = await VoucherModel.findOne({
        where: { id: order.voucherId },
      });

      await order.update({ voucherId: null });
      await voucher.update({ quantity: voucher.quantity + 1 });

      res.status(200).json({
        code: 0,
        message: "Xóa mã giảm giá thành công",
        totalPrice: order.totalPrice,
      });
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json(error.message);
    }
  }

  async getAverageRevenuePerDay(req, res) {
    try {
      const revenueData = await OrderModel.findAll({
        where: {
          statusPay: "Đã thanh toán",
          storeId: req.session.store.id,
        },
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
          [Sequelize.fn("SUM", Sequelize.col("totalPrice")), "averageRevenue"],
        ],
        group: ["date"],
        order: [["date", "ASC"]],
      });

      const formattedData = revenueData.map((item) => ({
        date: item.dataValues.date,
        averageRevenue: parseFloat(item.dataValues.averageRevenue),
      }));

      res.status(200).json({
        revenueData,
        code: 0,
        message: "Lấy dữ liệu thành công",
        data: formattedData,
      });
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json(error.message);
    }
  }

  async sendCodeOtpPointMember(req, res) {
    try {
      const { phoneNumber } = req.query;
      const tracking_id = Math.floor(Math.random() * 1e10)
        .toString()
        .padStart(5, "0");
      const pointMember = await PointMemberModel.findOne({
        where: { phoneNumber },
      });

      const newOtp = Math.floor(Math.random() * 1e10)
        .toString()
        .padStart(6, "0");
      await PointMemberModel.update(
        { otpCode: newOtp },
        { where: { id: pointMember.id } }
      );
      const dataZns = {
        phone: `84${phoneNumber.substring(1)}`,
        template_id: "390468",
        template_data: { otp: newOtp },
        tracking_id,
      };
      await sendZNS(dataZns);
      res.status(200).json({
        code: 0,
        message: "Yêu cầu gửi OTP thành công",
      });
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json(error.message);
    }
  }

  async verifyOtp(req, res) {
    try {
      const { phoneNumber } = req.query;
      const { otpCode } = req.body;

      if (!otpCode) {
        res.status(200).json({
          code: 1,
          message: "Thiếu OTP.",
        });

        return;
      }

      const pointMember = await PointMemberModel.findOne({
        where: { phoneNumber },
      });

      if (pointMember.otpCode == otpCode) {
        res.status(200).json({
          code: 0,
          message: "Mã Otp chính xác",
        });
        await pointMember.update({ otpCode: null });
      } else {
        res.status(200).json({
          code: 1,
          message: "Mã Otp không hợp lệ",
        });
      }
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json(error.message);
    }
  }
}

export default new OrderController();
