const { Op } = require("sequelize");

import { TableModel, StoreModel } from "../../../models";

const FOLDER_NAME = "admins/pages/tables";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Bàn ăn";

class TableController {
  // [GET] /tables
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /tables/all
  async all(req, res) {
    try {
      const tables = await TableModel.findAll({
        where: { status: false, storeId: req.session.store.id },
        attributes: [
          "id",
          "tableNumber",
          "tableStatus",
          "type",
          "maximumNumberOfPeople",
        ],
        include: [
          {
            model: StoreModel,
            as: "store",
            attributes: ["storeName"],
          },
        ],
      });

      const formattedTables = tables.map((table) => {
        const tableData = table.get({ plain: true });
        return {
          ...tableData,
          storeName: tableData.store ? tableData.store.storeName : null,
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedTables,
        message: "Lấy danh sách bàn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /tables/:id
  async find(req, res) {
    const { id } = req.params;
    try {
      const table = await TableModel.findOne({
        where: { id, status: false },
        attributes: [
          "id",
          "tableNumber",
          "tableStatus",
          "type",
          "maximumNumberOfPeople",
          "storeId",
        ],
        include: [
          {
            model: StoreModel,
            as: "store",
            attributes: ["storeName"],
          },
        ],
      });

      if (table) {
        const tableData = table.get({ plain: true });
        const formattedTable = {
          ...tableData,
          storeName: tableData.store ? tableData.store.storeName : null,
        };
        res.status(200).json({
          code: 0,
          data: formattedTable,
          message: "Tìm bàn thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Bàn không tồn tại",
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

  // [PUT] /tables/:id
  async update(req, res) {
    const { id } = req.params;
    const { tableNumber, type, maximumNumberOfPeople } = req.body;
    try {
      const checkTable = await TableModel.findOne({
        where: {
          tableNumber,
          status: false,
          id: {
            [Op.ne]: id,
          },
          storeId: req.session.store.id,
        },
      });

      if (checkTable) {
        return res.status(200).json({
          code: 1,
          message: "Số bàn đã tồn tại",
        });
      }

      const table = await TableModel.findOne({
        where: { id, status: false },
      });

      if (table) {
        await table.update({
          tableNumber,
          type,
          maximumNumberOfPeople,
        });
        res.status(200).json({
          code: 0,
          message: "Cập nhật bàn thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Bàn không tồn tại",
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

  // [DELETE] /tables/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const table = await TableModel.findOne({
        where: { id, status: false },
      });

      if (table) {
        await table.update({ status: true });
        res.status(200).json({
          code: 0,
          message: "Xóa bàn thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Bàn không tồn tại",
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

  // [POST] /tables
  async store(req, res) {
    const { tableNumber, type, maximumNumberOfPeople } = req.body;
    try {
      const checkTable = await TableModel.findOne({
        where: { tableNumber, status: false, storeId: req.session.store.id },
      });

      if (checkTable) {
        return res.status(200).json({
          code: 1,
          message: "Số bàn đã tồn tại",
        });
      }

      const table = await TableModel.create({
        tableNumber,
        type,
        tableStatus: "Bàn trống",
        maximumNumberOfPeople,
        storeId: req.session.store.id,
      });

      if (table) {
        res.status(201).json({
          code: 0,
          data: table,
          message: "Tạo bàn thành công",
        });
      } else {
        res.status(400).json({
          code: 1,
          message: "Tạo bàn thất bại",
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
}

export default new TableController();
