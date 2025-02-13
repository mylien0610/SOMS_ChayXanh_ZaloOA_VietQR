import { UserModel, RoleModel, StoreModel } from "../../../models";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/managers";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Quản lý";

class ManagerController {
  // [GET] /managers
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  // [GET] /managers/all
  async all(req, res) {
    try {
      const { roleId } = req.query;
      const whereCondition = {
        status: false,
        roleId: { [Op.not]: [1, 3, 4] },
      };

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
        ],
      });

      const formattedUsers = users.map((user) => {
        const userData = user.get({ plain: true });
        return {
          ...userData,
          roleName: userData.role ? userData.role.roleName : null,
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedUsers,
        message: "Lấy danh sách quản lý thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async getManagerNoStore(req, res) {
    try {
      const { idPlus } = req.query;
      let userIds = await StoreModel.findAll({
        attributes: ["managedBy"],
        where: { status: false },
      }).then((stores) => stores.map((store) => store.managedBy));

      if (idPlus) {
        const idPlusInt = parseInt(idPlus, 10);
        userIds = userIds.filter((id) => id !== idPlusInt);
      }

      console.log(userIds);

      const users = await UserModel.findAll({
        where: {
          status: false,
          roleId: 2,
          id: {
            [Op.notIn]: userIds,
          },
        },
      });

      res.status(200).json({
        code: 0,
        data: users,
        message: "Lấy danh sách quản lý thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /managers/:id
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
        ],
      });

      if (user) {
        const userData = user.get({ plain: true });
        const formattedUser = {
          ...userData,
          roleName: userData.role ? userData.role.roleName : null,
        };
        res.status(200).json({
          code: 0,
          data: formattedUser,
          message: "Tìm quản lý thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "quản lý không tồn tại",
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

  // [POST] /managers
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
        roleId: 2,
      });

      if (user) {
        res.status(201).json({
          code: 0,
          data: user,
          message: "Tạo quản lý thành công",
        });
      } else {
        res.status(400).json({
          code: 1,
          message: "Tạo quản lý thất bại",
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

  // [PUT] /managers/:id
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
          roleId: 2,
        });
        res.status(200).json({
          code: 0,
          message: "Cập nhật quản lý thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "quản lý không tồn tại",
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

  // [DELETE] /managers/:id
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
          message: "Xóa quản lý thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "quản lý không tồn tại",
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

export default new ManagerController();
