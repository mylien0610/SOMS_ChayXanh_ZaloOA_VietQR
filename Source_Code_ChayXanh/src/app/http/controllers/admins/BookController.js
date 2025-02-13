import {
  BookModel,
  TableModel,
  UserModel,
  OrderModel,
  PointMemberModel,
  StoreModel,
} from "../../../models";

const FOLDER_NAME = "admins/pages/books";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Bàn đặt";

import { Op } from "sequelize";
const moment = require("moment-timezone");

const sendEmail = require("../../../../utils/sendEmail");

class BookController {
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  async all(req, res) {
    try {
      const books = await BookModel.findAll({
        where: { status: 0 },
        include: [
          {
            model: TableModel,
            where: {
              storeId: req.session.store.id,
            },
            as: "table",
          },
          {
            model: UserModel,
            as: "user",
            include: [{ model: PointMemberModel, as: "pointMember" }],
          },
        ],
      });

      const formattedBooks = books.map((book) => {
        const bookData = book.get({ plain: true });
        return {
          ...bookData,
          tableNumber: bookData.table ? bookData.table.tableNumber : null,
          fullName: bookData.user.fullName,
          phoneNumber: bookData.user.pointMember.phoneNumber,
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedBooks,
        message: "Lấy danh sách đặt bàn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async store(req, res) {
    try {
      const storeId = req.session.store.id;
      const { time, date, peopleNumber } = req.body;

      let tables = [];

      // Chuyển đổi ngày sang múi giờ của cơ sở dữ liệu (giả sử UTC+7)
      const localDate = moment
        .tz(date, "UTC")
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD");

      // Lấy danh sách tableId đã được đặt
      const bookedTableIds = await BookModel.findAll({
        attributes: ["tableId"],
        where: {
          date: {
            [Op.gte]: `${localDate} 00:00:00`, // Từ đầu ngày
            [Op.lte]: `${localDate} 23:59:59`, // Đến cuối ngày
          },
          time: {
            [Op.eq]: time, // So khớp giờ chính xác
          },
          statusBook: { [Op.in]: [0, 1] }, // Chỉ trạng thái đặt chỗ 0 hoặc 1
        },
      }).then((books) => books.map((book) => book.tableId));

      const whereConditions = {
        status: 0,
        tableStatus: "Bàn trống",
        id: { [Op.notIn]: bookedTableIds }, // Loại trừ các bàn đã được đặt
        storeId,
        maximumNumberOfPeople: { [Op.gte]: peopleNumber }, // Đủ sức chứa
      };

      // Lấy danh sách bàn trống
      tables = await TableModel.findAll({
        where: whereConditions,
        include: [
          {
            model: StoreModel,
            as: "store",
            where: { active: true }, // Chỉ chi nhánh hoạt động
          },
        ],
        order: [["storeId", "ASC"]],
      });

      // Kiểm tra nếu không có bàn trống
      if (tables.length === 0) {
        return res.status(200).json({
          code: 1,
          message: "Không còn bàn trống vào thời gian này",
        });
      }

      //  Tạo booking mới

      res.status(200).json({
        code: 0,
        message: "Chuyển chi nhánh thành công",
      });
    } catch (error) {
      console.error("Lỗi server:", error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async find(req, res) {
    const { id } = req.params;
    try {
      const book = await BookModel.findOne({
        where: { id, status: false },
      });

      if (book) {
        res.status(200).json({
          code: 0,
          data: book,
          message: "Tìm đặt bàn thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Bàn đặt không tồn tại",
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

  async confirm(req, res) {
    const { id } = req.params;
    try {
      const [updatedRowsCount] = await BookModel.update(
        { statusBook: 1 },
        { where: { id } }
      );

      if (updatedRowsCount === 0) {
        return res.status(404).json({
          code: 1,
          message: "Không tìm thấy bàn đặt hoặc bàn đã được xác nhận",
        });
      }

      const book = await BookModel.findOne({
        where: { id },
        include: [{ model: UserModel, as: "user" }],
      });

      await sendEmail(
        book.user.email,
        "Phản hồi thông tin đặt bàn",
        "Quản trị viên của chúng tôi đã phê duyệt đơn đặt bàn của bạn. Chúng tôi rất mong được chào đón bạn. Cảm ơn bạn đã lựa chọn Chay Xanh!"
      );

      res.status(200).json({
        code: 0,
        message: "Xác nhận bàn đặt thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { statusBook } = req.body;
      const booking = await BookModel.findOne({
        where: { id },
        include: [
          {
            model: UserModel,
            as: "user",
            include: [{ model: PointMemberModel, as: "pointMember" }],
          },
          {
            model: TableModel,
            as: "table",
            include: [{ model: StoreModel, as: "store" }],
          },
        ],
      });
      await booking.update({ statusBook });
      const user = booking.user;
      const pointMember = booking.user.pointMember;
      const table = booking.table;
      const store = booking.table.store;
      let message = "";
      if (statusBook == 0) {
        message =
          "Đơn đặt của bạn đã được chuyển trạng thái thành Chờ xác nhận.";
      } else if (statusBook == 1) {
        message =
          "Đơn đặt bàn của bản đã được chuyển trạng thái thành Đã xác nhận";
      } else if (statusBook == 2) {
        message = "Đơn của bạn đã bị từ chối";
      } else if (statusBook == 3) {
        message = "Cảm ơn quí khách đã đến";
        // Handle create order when customer ready

        // - Data order
        const orderData = {
          tableId: booking.tableId,
          tableNumber: table.tableNumber,
          totalPrice: 0,
          statusPay: "Chưa thanh toán",
          fullName: user.fullName,
          phoneNumber: pointMember.phoneNumber,
          storeId: store.id,
          paymentBy: req.session.user.id,
        };
        // - Update Status table
        await table.update(
          { tableStatus: "Được sử dụng" },
          { where: { id: table.id } }
        );
        // - Create Order
        await OrderModel.create(orderData);
      } else if (statusBook == 4) {
        message =
          "Bàn đặt bị hủy do bạn không tới đúng thời gian. Chúng tôi hẹn gặp bạn vào lần sau.";
      }

      await sendEmail(user.email, "Phản hồi thông tin đặt bàn", message);
      res.status(200).json({
        code: 0,
        message: "Cập nhật trạng thái thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async cancel(req, res) {
    const { id } = req.params;
    try {
      const booking = await BookModel.findOne({
        where: { id },
        include: [{ model: UserModel, as: "user" }],
      });
      await booking.update({ statusBook: 2 });

      await sendEmail(
        booking.user.email,
        "Phản hồi thông tin đặt bàn",
        "Quản trị viên của chúng tôi đã từ chối đơn đặt bàn của bạn."
      );
      res.status(200).json({
        code: 0,
        message: "Hủy bàn đặt thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async changeStore(req, res) {
    try {
      const { bookId } = req.query;
      const { storeId } = req.body;

      let tables = [];

      // Tìm thông tin booking hiện tại
      const book = await BookModel.findOne({ where: { id: bookId } });
      if (!book) {
        return res.status(404).json({
          code: 1,
          message: "Không tìm thấy thông tin đặt bàn",
        });
      }

      const time = book.time; // Định dạng HH:mm:ss
      const date = book.date; // Định dạng UTC: YYYY-MM-DD

      const peopleNumber = book.peopleNumber;

      // Chuyển đổi ngày sang múi giờ của cơ sở dữ liệu (giả sử UTC+7)
      const localDate = moment
        .tz(date, "UTC")
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD");

      // Lấy danh sách tableId đã được đặt
      const bookedTableIds = await BookModel.findAll({
        attributes: ["tableId"],
        where: {
          date: {
            [Op.gte]: `${localDate} 00:00:00`, // Từ đầu ngày
            [Op.lte]: `${localDate} 23:59:59`, // Đến cuối ngày
          },
          time: {
            [Op.eq]: time, // So khớp giờ chính xác
          },
          statusBook: { [Op.in]: [0, 1] }, // Chỉ trạng thái đặt chỗ 0 hoặc 1
        },
      }).then((books) => books.map((book) => book.tableId));

      const whereConditions = {
        status: 0,
        tableStatus: "Bàn trống",
        id: { [Op.notIn]: bookedTableIds }, // Loại trừ các bàn đã được đặt
        storeId,
        maximumNumberOfPeople: { [Op.gte]: peopleNumber }, // Đủ sức chứa
      };

      // Lấy danh sách bàn trống
      tables = await TableModel.findAll({
        where: whereConditions,
        include: [
          {
            model: StoreModel,
            as: "store",
            where: { active: true }, // Chỉ chi nhánh hoạt động
          },
        ],
        order: [["storeId", "ASC"]],
      });

      // Kiểm tra nếu không có bàn trống
      if (tables.length === 0) {
        return res.status(200).json({
          code: 1,
          message: "Chi nhánh này đã hết bàn",
        });
      }

      console.log("Danh sách bàn trống:", tables);

      // Cập nhật booking với tableId mới
      await BookModel.update(
        { tableId: tables[0].id },
        { where: { id: bookId } }
      );

      res.status(200).json({
        code: 0,
        message: "Chuyển chi nhánh thành công",
      });
    } catch (error) {
      console.error("Lỗi server:", error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }
}

module.exports = new BookController();
