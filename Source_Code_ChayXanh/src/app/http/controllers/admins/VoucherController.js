import { VoucherModel, OrderModel } from "../../../models";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/vouchers";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Voucher";

class VoucherController {
  // [GET] /vouchers
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /vouchers/all
  async all(req, res) {
    try {
      const vouchers = await VoucherModel.findAll({
        where: { status: false },
        include: [
          {
            model: OrderModel,
            as: "orders",
            attributes: ["id"],
          },
        ],
      });
      const formattedVouchers = vouchers.map((voucher) => {
        const voucherData = voucher.get({ plain: true });
        return {
          ...voucherData,
          usageCount: voucherData.orders ? voucherData.orders.length : 0,
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedVouchers,
        message: "Lấy danh sách voucher thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [POST] /vouchers
  async store(req, res) {
    const { title, voucherCode, value, dateStart, dateEnd, quantity } =
      req.body;
    try {
      const checkTitleVoucher = await VoucherModel.findOne({
        where: { title, status: false },
      });

      if (checkTitleVoucher) {
        return res.status(200).json({
          code: 1,
          message: "Tên voucher đã tồn tại",
        });
      }

      const checkCodeVoucher = await VoucherModel.findOne({
        where: { voucherCode, status: false },
      });

      if (checkCodeVoucher) {
        return res.status(200).json({
          code: 1,
          message: "Mã voucher đã tồn tại",
        });
      }

      const voucher = await VoucherModel.create({
        title,
        voucherCode,
        value,
        dateStart,
        dateEnd,
        quantity,
        status: false,
      });
      if (voucher) {
        res.status(201).json({
          code: 0,
          message: "Tạo voucher thành công",
        });
      } else {
        res.status(400).json({
          code: 1,
          message: "Tạo voucher thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /vouchers/getOrders
  async getOrdersByVoucherId(req, res) {
    const { id } = req.params;
    try {
      const voucher = await VoucherModel.findOne({
        where: {
          id,
        },
        include: [
          {
            model: OrderModel,
            as: "orders",
          },
        ],
      });

      res.status(200).json({
        code: 1,
        data: voucher.orders,
        voucherTitle: voucher.title,
        message: "lấy hóa đơn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /vouchers/:id
  async find(req, res) {
    const { id } = req.params;
    try {
      const voucher = await VoucherModel.findOne({
        where: { id, status: false },
        include: [
          {
            model: OrderModel,
            as: "orders",
            attributes: ["id"],
          },
        ],
      });

      if (voucher) {
        const voucherData = voucher.get({ plain: true });
        const formattedVoucher = {
          ...voucherData,
          usageCount: voucherData.orders ? voucherData.orders.length : 0,
        };

        res.status(200).json({
          code: 0,
          data: formattedVoucher,
          message: "Tìm voucher thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Voucher không tồn tại",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [PUT] /vouchers/:id
  async update(req, res) {
    const { id } = req.params;
    const { title, voucherCode, value, dateStart, dateEnd, quantity } =
      req.body;
    try {
      const checkTitleVoucher = await VoucherModel.findOne({
        where: { title, status: false, id: { [Op.ne]: id } },
      });

      if (checkTitleVoucher) {
        return res.status(200).json({
          code: 1,
          message: "Tên voucher đã tồn tại",
        });
      }

      const checkCodeVoucher = await VoucherModel.findOne({
        where: { voucherCode, status: false, id: { [Op.ne]: id } },
      });

      if (checkCodeVoucher) {
        return res.status(200).json({
          code: 1,
          message: "Mã voucher đã tồn tại",
        });
      }

      const voucher = await VoucherModel.findOne({
        where: { id, status: false },
      });

      if (voucher) {
        await voucher.update({
          title,
          voucherCode,
          value,
          dateStart,
          dateEnd,
          quantity,
        });
        res.status(200).json({
          code: 0,
          message: "Cập nhật voucher thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Voucher không tồn tại",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [DELETE] /vouchers/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const voucher = await VoucherModel.findOne({
        where: { id, status: false },
      });

      if (voucher) {
        // Soft delete by updating status to true
        await voucher.update({ status: true });
        res.status(200).json({
          code: 0,
          message: "Xóa voucher thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Voucher không tồn tại",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [POST] /vouchers/verify
  async verifyVoucher(req, res) {
    const { voucherCode, orderId } = req.body;
    try {
      const voucher = await VoucherModel.findOne({
        where: {
          voucherCode,
          status: false,
        },
      });

      if (!voucher) {
        return res.status(200).json({
          code: 1,
          message: "Mã giảm giá không tồn tại",
        });
      }

      if (voucher.quantity == 0) {
        return res.status(200).json({
          code: 1,
          message: "Mã giảm giá đã hết số lần sử dụng!",
        });
      }

      res.status(200).json({
        code: 0,
        message: "Lấy mã giảm giá thành công",
        data: voucher,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Lỗi server",
      });
    }
  }
}

export default new VoucherController();
