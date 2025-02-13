import {
  UserModel,
  RoleModel,
  BelongStoreModel,
  StoreModel,
} from "../../../models";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/staffs";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Nhân viên";

class StaffController {
  // [GET] /users
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /users/all
  async all(req, res) {
    try {
      const { roleId } = req.query;
      const whereCondition = {
        status: false,
        roleId: { [Op.not]: [1, 2, 4] },
      };

      // Query
      if (roleId) {
        whereCondition.roleId = roleId;
      }

      const users = await UserModel.findAll({
        where: whereCondition,
        include: [
          {
            model: RoleModel,
            as: "role",
            attributes: ["roleName"],
          },
          {
            model: StoreModel,
            as: "stores",
            where: { id: req.session.store.id },
            attributes: ["id", "storeName"],
            through: { attributes: [] },
          },
        ],
      });

      const formattedUsers = users.map((user) => {
        const userData = user.get({ plain: true });
        return {
          ...userData,
          roleName: userData.role ? userData.role.roleName : null,
          stores:
            userData.stores.length > 0
              ? userData.stores.map((store) => store.storeName).join(", ")
              : "Không có chi nhánh",
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedUsers,
        message: "Lấy danh sách nhân viên thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /users/:id
  async find(req, res) {
    const { id } = req.params;
    try {
      const user = await UserModel.findOne({
        where: { id, status: false },
        include: [
          {
            model: RoleModel,
            as: "role",
            attributes: ["roleName"],
          },
          {
            model: StoreModel,
            as: "stores",
            attributes: ["id", "storeName"],
            through: { attributes: [] },
          },
        ],
      });

      if (user) {
        const userData = user.get({ plain: true });
        const formattedUser = {
          ...userData,
          roleName: userData.role ? userData.role.roleName : null,
          stores: userData.stores,
        };
        res.status(200).json({
          code: 0,
          data: formattedUser,
          message: "Tìm nhân viên thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Nhân viên không tồn tại",
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

  // [POST] /users
  async store(req, res) {
    const { fullName, email, gender, dob, password } = req.body;
    try {
      const checkUser = await UserModel.findOne({
        where: {
          email,
          status: false,
          roleId: {
            [Op.in]: [2, 3],
          },
        },
      });

      if (checkUser) {
        return res.status(200).json({
          code: 1,
          message: "Email đã tồn tại",
        });
      }
      const user = await UserModel.create({
        fullName,
        email,
        gender,
        dob,
        password,
        roleId: 3,
      });

      if (user) {
        await BelongStoreModel.create({
          userId: user.id,
          storeId: req.session.store.id,
        });
        res.status(201).json({
          code: 0,
          data: user,
          message: "Tạo nhân viên thành công",
        });
      } else {
        res.status(400).json({
          code: 1,
          message: "Tạo nhân viên thất bại",
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

  // [PUT] /users/:id
  async update(req, res) {
    const { id } = req.params;
    const { fullName, email, gender, dob } = req.body;
    try {
      const checkUser = await UserModel.findOne({
        where: {
          email,
          status: false,
          id: { [Op.ne]: id },
          roleId: {
            [Op.in]: [2, 3],
          },
        },
      });

      if (checkUser) {
        return res.status(200).json({
          code: 1,
          message: "Email đã tồn tại",
        });
      }
      const user = await UserModel.findOne({
        where: { id, status: false },
      });

      if (user) {
        await user.update({
          fullName,
          email,
          gender,
          dob,
        });
        res.status(200).json({
          code: 0,
          message: "Cập nhật nhân viên thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Nhân viên không tồn tại",
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

  // [DELETE] /users/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const user = await UserModel.findOne({
        where: { id, status: false },
      });

      if (user) {
        await user.update({ status: true });
        res.status(200).json({
          code: 0,
          message: "Xóa nhân viên thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Nhân viên không tồn tại",
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

  // [GET] /stores/available-staffs/:id
  async getAvailableStaffs(req, res) {
    const { id } = req.params;
    try {
      const users = await UserModel.findAll({
        where: { status: false },
        include: [
          {
            model: RoleModel,
            as: "role",
            attributes: ["roleName"],
          },
          {
            model: StoreModel,
            as: "stores",
            where: { id },
            attributes: ["id", "storeName"],
            through: { attributes: [] },
          },
        ],
      });

      res.status(200).json({
        code: 0,
        data: users,
        message: "Thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /users/unassigned
  async getUnassignedStaffs(req, res) {
    const { storeId } = req.params;
    const belongStore = await BelongStoreModel.findAll({
      where: { storeId },
    });

    const userIds = belongStore.map((item) => item.userId);
    try {
      const unassignedStaffs = await UserModel.findAll({
        where: {
          status: false,
          roleId: { [Op.not]: [1, 2, 4] },
          id: { [Op.notIn]: userIds },
        },
      });

      res.status(200).json({
        code: 0,
        data: unassignedStaffs,
        message: "Lấy danh sách nhân viên chưa được phân công thành công",
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

export default new StaffController();
