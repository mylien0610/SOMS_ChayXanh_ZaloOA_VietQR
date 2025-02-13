import { CategoryModel } from "../../../models";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/categories";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Danh mục";

class CategoryController {
  // [GET] /categories
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /categories/all
  async all(req, res) {
    try {
      const categories = await CategoryModel.findAll({
        where: { status: false },
        attributes: ["id", "title"],
      });

      res.status(200).json({
        code: 0,
        data: categories,
        message: "Lấy danh sách danh mục thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /categories/:id
  async find(req, res) {
    const { id } = req.params;
    try {
      const category = await CategoryModel.findOne({
        where: { id, status: false },
        attributes: ["id", "title"],
      });

      if (category) {
        res.status(200).json({
          code: 0,
          data: category,
          message: "Tìm danh mục thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Danh mục không tồn tại",
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

  // [PUT] /categories/:id
  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    try {
      const checkCategory = await CategoryModel.findOne({
        where: { title, status: false, id: { [Op.ne]: id } },
      });
      if (checkCategory) {
        return res.status(200).json({
          code: 1,
          message: "Danh mục đã tồn tại",
        });
      }
      const category = await CategoryModel.findOne({
        where: { id, status: false },
      });

      if (category) {
        await category.update({ title });
        res.status(200).json({
          code: 0,
          message: "Cập nhật danh mục thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Danh mục không tồn tại",
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

  // [DELETE] /categories/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const category = await CategoryModel.findOne({
        where: { id, status: false },
      });

      if (category) {
        // Soft delete by updating status to true
        await category.update({ status: true });
        res.status(200).json({
          code: 0,
          message: "Xóa danh mục thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Danh mục không tồn tại",
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

  // [POST] /categories
  async store(req, res) {
    const { title } = req.body;
    try {
      const checkCategory = await CategoryModel.findOne({
        where: { title, status: false },
      });
      if (checkCategory) {
        return res.status(200).json({
          code: 1,
          message: "Danh mục đã tồn tại",
        });
      }
      const category = await CategoryModel.create({
        title,
      });

      if (category) {
        res.status(201).json({
          code: 0,
          data: category,
          message: "Tạo danh mục thành công",
        });
      } else {
        res.status(400).json({
          code: 1,
          message: "Tạo danh mục thất bại",
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

export default new CategoryController();
