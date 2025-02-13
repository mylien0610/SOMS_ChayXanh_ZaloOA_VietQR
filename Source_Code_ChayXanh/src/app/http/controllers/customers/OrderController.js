const FOLDER_NAME = "customers/pages/orders";
const MAIN_LAYOUT = "customers/layouts/main-layout";
const TITLE = "Đặt bàn";

const {
  TableModel,
  StoreModel,
  BookModel,
  UserModel,
} = require("../../../models");
import { Op } from "sequelize";

class OrderController {
  async index(req, res) {
    try {
      const { store, peopleNumber, date, time } = req.query;
      let tables = [];

      if (date && time) {
        // Tìm các bàn đã được đặt
        const bookedTableIds = await BookModel.findAll({
          attributes: ["tableId"],
          where: {
            date: {
              [Op.gte]: new Date(`${date}T00:00:00`), // Chỉ lấy các bản ghi có ngày từ 00:00:00
              [Op.lt]: new Date(`${date}T23:59:59`), // Chỉ lấy các bản ghi có ngày đến 23:59:59
            }, // Điều kiện ngày
            time, // Điều kiện giờ
            statusBook: { [Op.in]: [0, 1] }, // Trạng thái đặt chỗ: 0 hoặc 1
          },
        }).then((books) => books.map((book) => book.tableId)); // Lấy danh sách tableId đã được đặt

        // Điều kiện truy vấn bảng TableModel
        const whereConditions = {
          status: 0,
          tableStatus: "Bàn trống",
          id: { [Op.notIn]: bookedTableIds }, // Loại trừ những bàn đã được đặt
        };

        if (store && store !== "all") {
          whereConditions.storeId = store; // Điều kiện theo store
        }

        // Nếu peopleNumber được cung cấp, thêm điều kiện lọc theo maximumNumberOfPeople
        if (peopleNumber) {
          whereConditions.maximumNumberOfPeople = { [Op.gte]: peopleNumber }; // Bàn đủ chỗ cho số người
        }

        // Lấy danh sách bàn trống
        tables = await TableModel.findAll({
          where: whereConditions,
          include: [
            {
              model: StoreModel,
              as: "store",
              where: { active: true },
            },
          ],
          order: [["storeId", "ASC"]],
        });
      }

      // Lấy danh sách cửa hàng
      const stores = await StoreModel.findAll({
        where: { active: true, status: false },
      });

      const uniqueTables = {};
      const filteredTables = tables.filter((table) => {
        if (!uniqueTables[table.storeId]) {
          uniqueTables[table.storeId] = true;
          return true; // Chỉ lấy bàn đầu tiên của mỗi cửa hàng
        }
        return false; // Bỏ qua các bàn khác của cửa hàng đã có
      });

      // Render dữ liệu ra view
      res.render(`${FOLDER_NAME}/index`, {
        title: TITLE,
        layout: MAIN_LAYOUT,
        date,
        time,
        stores,
        storeId: store,
        tables: filteredTables,
      });
    } catch (error) {
      console.error(error);
      res.render(`${FOLDER_NAME}/index`, {
        title: TITLE,
        layout: MAIN_LAYOUT,
      });
    }
  }

  async submitBooking(req, res) {
    try {
      const { tableId } = req.query;
      const { time, date, peopleNumber } = req.body;

      const { id } = req.session.customer;
      const data = {
        userId: id,
        tableId,
        time,
        date,
        peopleNumber,
      };
      const book = await BookModel.create(data);
      res.status(200).json({
        code: 0,
        book,
        message: "Đặt bàn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: `Lỗi server ${error}`,
      });
    }
  }

  async orderHistory(req, res) {
    try {
      const books = await BookModel.findAll({
        where: { status: 0 },
        include: [
          {
            model: UserModel,
            as: "user",
            where: {
              id: req.session.customer.id,
            },
          },
          {
            model: TableModel,
            as: "table",
            include: [{ model: StoreModel, as: "store" }],
          },
        ],
      });
      res.render(`${FOLDER_NAME}/history`, {
        title: TITLE,
        layout: MAIN_LAYOUT,
        tables: books,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new OrderController();
