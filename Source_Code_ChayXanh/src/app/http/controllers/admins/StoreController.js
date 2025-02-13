import { StoreModel, UserModel, BelongStoreModel } from "../../../models";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/stores";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Cửa hàng";

class StoreController {
  // [GET] /stores
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /stores/all
  async all(req, res) {
    const { active } = req.query;
    try {
      const where = { status: 0 };
      if (active && active != "all") {
        where.active = active;
      }
      const stores = await StoreModel.findAll({
        where: where,
        include: [
          {
            model: UserModel,
            attributes: ["fullName"],
          },
        ],
      });
      const formattedStores = stores.map((store) => {
        const storeData = store.get({ plain: true });
        return {
          ...storeData,
          fullName: storeData.UserModel
            ? storeData.UserModel.fullName
            : "Trống",
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedStores,
        message: "Thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [POST] /stores/store
  async store(req, res) {
    const data = req.body;
    try {
      const checkStore = await StoreModel.findOne({
        where: { storeName: data.storeName, status: false },
      });
      if (checkStore) {
        return res.status(200).json({
          code: 1,
          message: "Tên cửa hàng đã tồn tại",
        });
      }
      const store = await StoreModel.create(data);
      if (store) {
        res.status(200).json({
          code: 0,
          message: "Tạo cửa hàng thành công",
        });
      } else {
        res.status(200).json({
          code: 1,
          message: "Tạo cửa hàng thất bại",
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /stores/:id
  async find(req, res) {
    const { id } = req.params;
    try {
      const store = await StoreModel.findOne({
        where: { id, status: 0 },
        include: [
          {
            model: UserModel,
            attributes: ["fullName", "id"],
          },
        ],
      });

      if (store) {
        const storeData = store.get({ plain: true });
        const formattedStore = {
          ...storeData,
          idUser: storeData.UserModel ? storeData.UserModel.id : null,
          fullName: storeData.UserModel ? storeData.UserModel.fullName : null,
        };

        res.status(200).json({
          code: 0,
          data: formattedStore,
          message: "Thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Cửa hàng không tồn tại",
        });
      }
    } catch (error) {
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [PUT] /stores/:id
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
      const checkStore = await StoreModel.findOne({
        where: {
          storeName: data.storeName,
          status: false,
          id: { [Op.ne]: id },
        },
      });

      if (checkStore) {
        return res.status(200).json({
          code: 1,
          message: "Tên cửa hàng đã tồn tại",
        });
      }
      const store = await StoreModel.findOne({
        where: { id, status: 0 },
      });

      if (store) {
        await store.update(data);
        res.status(200).json({
          code: 0,
          message: "Cập nhật cửa hàng thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Cửa hàng không tồn tại",
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

  // [DELETE] /stores/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const store = await StoreModel.findOne({
        where: { id, status: 0 },
      });

      if (store) {
        // Soft delete by updating status to 1
        await store.update({ status: 1 });
        res.status(200).json({
          code: 0,
          message: "Xóa cửa hàng thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Cửa hàng không tồn tại",
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

  // [POST] /stores/add-staffs
  async addStaffs(req, res) {
    const { storeId, staffIds } = req.body;
    try {
      const store = await StoreModel.findOne({
        where: { id: storeId, status: 0 },
      });

      if (store) {
        await BelongStoreModel.bulkCreate(
          staffIds.map((id) => ({
            storeId: storeId,
            userId: id,
          }))
        );

        res.status(200).json({
          code: 0,
          message: "Thêm nhân viên thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Cửa hàng không tồn tại",
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

  // [GET] /stores/unassigned-staffs/:storeId
  async unassignedStaffs(req, res) {
    const { storeId, userId } = req.params;
    try {
      // Delete row in BelongStoreModel
      await BelongStoreModel.destroy({
        where: { storeId, userId },
      });

      res.status(200).json({
        code: 0,
        message: "Xóa nhân viên thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async getStoreNotCurrentStore(req, res) {
    try {
      const stores = await StoreModel.findAll({
        where: {
          id: {
            [Op.ne]: req.session.store.id,
          },
          active: 1,
        },
      });

      res.status(200).json({
        code: 0,
        data: stores,
        message: "Lấy danh sách chi nhánh thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }
}

export default new StoreController();
