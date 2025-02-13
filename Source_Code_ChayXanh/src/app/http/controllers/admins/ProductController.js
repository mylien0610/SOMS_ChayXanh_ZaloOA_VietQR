import { ProductModel, CategoryModel, TypeOfFoodModel } from "../../../models";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/products";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Sản phẩm";
const STORAGE_PATH = "src/public/storages_image";

class ProductController {
  // [GET] /products
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /products/all
  async all(req, res) {
    try {
      const products = await ProductModel.findAll({
        where: { status: false },
        include: [
          {
            model: CategoryModel,
            as: "category",
            attributes: ["id", "title"],
          },
          {
            model: TypeOfFoodModel,
            as: "typeOfFood",
            attributes: ["id", "title"],
          },
        ],
        attributes: ["id", "title", "price", "image", "description"],
      });

      const formattedProducts = products.map((product) => {
        const productData = product.get({ plain: true });
        return {
          ...productData,
          categoryTitle: productData.category
            ? productData.category.title
            : null,
          categoryId: productData.category ? productData.category.id : null,
          typeOfFoodTitle: productData.typeOfFood
            ? productData.typeOfFood.title
            : null,
          typeOfFoodId: productData.typeOfFood
            ? productData.typeOfFood.id
            : null,
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedProducts,
        message: "Lấy danh sách sản phẩm thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /products/:id
  async find(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductModel.findOne({
        where: { id, status: false },
        include: [
          {
            model: CategoryModel,
            as: "category",
            attributes: ["id", "title"],
          },
          {
            model: TypeOfFoodModel,
            as: "typeOfFood",
            attributes: ["id", "title"],
          },
        ],
        attributes: [
          "id",
          "title",
          "price",
          "image",
          "description",
          "categoryId",
          "typeOfFoodId",
        ],
      });

      if (product) {
        const productData = product.get({ plain: true });
        const formattedProduct = {
          ...productData,
          categoryTitle: productData.category
            ? productData.category.title
            : null,
          typeOfFoodTitle: productData.typeOfFood
            ? productData.typeOfFood.title
            : null,
        };

        res.status(200).json({
          code: 0,
          data: formattedProduct,
          message: "Tìm sản phẩm thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Sản phẩm không tồn tại",
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

  // [PUT] /products/:id
  async update(req, res) {
    const { id } = req.params;
    const { title, price, categoryId, typeOfFoodId, description } = req.body;
    try {
      const checkProduct = await ProductModel.findOne({
        where: { title, status: false, id: { [Op.ne]: id } },
      });

      if (checkProduct) {
        return res.status(200).json({
          code: 1,
          message: "Tên món ăn đã tồn tại",
        });
      }
      const product = await ProductModel.findOne({
        where: { id, status: false },
      });

      if (!product) {
        return res.status(404).json({
          code: 1,
          message: "Sản phẩm không tồn tại",
        });
      }

      let image = product.image;
      if (req.files && req.files.image) {
        // Xóa ảnh cũ nếu tồn tại
        if (product.image) {
          const oldImagePath = path.join(STORAGE_PATH, product.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        const newImage = req.files.image;
        const fileName = `${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}${path.extname(newImage.name)}`;
        const uploadPath = path.join(STORAGE_PATH, fileName);

        await newImage.mv(uploadPath);
        image = fileName;
      }

      await product.update({
        title,
        price,
        image,
        categoryId,
        typeOfFoodId,
        description,
      });

      res.status(200).json({
        code: 0,
        message: "Cập nhật sản phẩm thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [DELETE] /products/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductModel.findOne({
        where: { id, status: false },
      });

      if (product) {
        // Soft delete by updating status to true
        await product.update({ status: true });
        res.status(200).json({
          code: 0,
          message: "Xóa sản phẩm thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Sản phẩm không tồn tại",
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

  // [POST] /products
  async store(req, res) {
    try {
      const { title, price, categoryId, typeOfFoodId, description } = req.body;

      const checkProduct = await ProductModel.findOne({
        where: { title, status: false },
      });

      if (checkProduct) {
        return res.status(200).json({
          code: 1,
          message: "Tên món ăn đã tồn tại",
        });
      }

      if (!req.files || !req.files.image) {
        return res.status(400).json({
          code: 1,
          message: "Vui lòng tải lên hình ảnh sản phẩm",
        });
      }

      const image = req.files.image;

      // Kiểm tra loại file
      if (!image.mimetype.startsWith("image/")) {
        return res.status(400).json({
          code: 1,
          message: "Vui lòng tải lên file hình ảnh hợp lệ",
        });
      }

      const maxSize = 5 * 1024 * 1024;
      if (image.size > maxSize) {
        return res.status(400).json({
          code: 1,
          message: "Kích thước file quá lớn. Vui lòng tải lên file nhỏ hơn 5MB",
        });
      }

      const fileName = `${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}${path.extname(image.name)}`;
      const uploadPath = path.join(STORAGE_PATH, fileName);

      image.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).json({
            code: 2,
            message: "Lỗi khi tải lên file: " + err.message,
          });
        }

        try {
          const product = await ProductModel.create({
            title,
            price,
            image: fileName,
            categoryId,
            typeOfFoodId,
            description,
          });

          res.status(201).json({
            code: 0,
            data: product,
            message: "Tạo sản phẩm thành công",
          });
        } catch (error) {
          console.error("Lỗi khi tạo sản phẩm:", error);
          res.status(500).json({
            code: 2,
            message: "Lỗi máy chủ: " + error.message,
          });
        }
      });
    } catch (error) {
      console.error("Lỗi trong phương thức store:", error);
      res.status(500).json({
        code: 2,
        message: "Lỗi máy chủ: " + error.message,
      });
    }
  }
}

export default new ProductController();
