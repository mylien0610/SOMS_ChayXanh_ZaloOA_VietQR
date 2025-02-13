import { TypeOfFoodModel } from "../../../models";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/typeOfFoods";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Loại món ăn";

class TypeOfFoodController {
  // [GET] /typeOfFoods
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /typeOfFoods/all
  async all(req, res) {
    try {
      const typeOfFoods = await TypeOfFoodModel.findAll({
        where: { status: false },
        attributes: ["id", "title"],
      });

      res.status(200).json({
        code: 0,
        data: typeOfFoods,
        message: "Lấy danh sách loại món ăn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /typeOfFoods/:id
  async find(req, res) {
    const { id } = req.params;
    try {
      const typeOfFood = await TypeOfFoodModel.findOne({
        where: { id, status: false },
        attributes: ["id", "title"],
      });

      if (typeOfFood) {
        res.status(200).json({
          code: 0,
          data: typeOfFood,
          message: "Tìm loại món ăn thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Loại món ăn không tồn tại",
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

  // [PUT] /typeOfFoods/:id
  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    try {
      const checkTypeOfFood = await TypeOfFoodModel.findOne({
        where: { title, status: false, id: { [Op.ne]: id } },
      });

      if (checkTypeOfFood) {
        return res.status(200).json({
          code: 1,
          message: "Loại món ăn đã tồn tại",
        });
      }
      const typeOfFood = await TypeOfFoodModel.findOne({
        where: { id, status: false },
      });

      if (typeOfFood) {
        await typeOfFood.update({ title });
        res.status(200).json({
          code: 0,
          message: "Cập nhật loại món ăn thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Loại món ăn không tồn tại",
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

  // [DELETE] /typeOfFoods/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const typeOfFood = await TypeOfFoodModel.findOne({
        where: { id, status: false },
      });

      if (typeOfFood) {
        // Soft delete by updating status to true
        await typeOfFood.update({ status: true });
        res.status(200).json({
          code: 0,
          message: "Xóa loại món ăn thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Loại món ăn không tồn tại",
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

  // [POST] /typeOfFoods
  async store(req, res) {
    const { title } = req.body;
    try {
      const checkTypeOfFood = await TypeOfFoodModel.findOne({
        where: { title, status: false },
      });

      if (checkTypeOfFood) {
        return res.status(200).json({
          code: 1,
          message: "Loại món ăn đã tồn tại",
        });
      }

      const typeOfFood = await TypeOfFoodModel.create({ title });

      if (typeOfFood) {
        res.status(201).json({
          code: 0,
          data: typeOfFood,
          message: "Tạo loại món ăn thành công",
        });
      } else {
        res.status(400).json({
          code: 1,
          message: "Tạo loại món ăn thất bại",
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

export default new TypeOfFoodController();
