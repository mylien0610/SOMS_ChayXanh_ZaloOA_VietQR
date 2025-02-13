import {
  UserModel,
  RoleModel,
  PointMemberModel,
  OrderModel,
} from "../../../models";
import { Op } from "sequelize";

const FOLDER_NAME = "admins/pages/customers";
const MAIN_LAYOUT = "admins/layouts/main-layout";
const TITLE = "Nhân viên";

class CustomerController {
  // [GET] /customers
  index(req, res) {
    res.render(`${FOLDER_NAME}/index`, {
      layout: MAIN_LAYOUT,
      title: TITLE,
    });
  }

  async getOrdersHistory(req, res) {
    const { id } = req.params;
    try {
      const user = await UserModel.findOne({
        where: { id },
        include: [{ model: PointMemberModel, as: "pointMember" }],
      });

      const phoneNumber = user?.pointMember?.phoneNumber;
      if (!phoneNumber) {
        return res.status(200).json({
          code: 0,
          data: null,
          message: "Không có thông tin",
        });
      }
      const orders = await OrderModel.findAll({
        where: {
          phoneNumber,
          statusPay: "Đã thanh toán",
        },
      });

      res.status(200).json({
        code: 0,
        data: { user, orders },
        message: "Lấy khách hàng thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async checkPointMember(req, res) {
    const { phoneNumber } = req.query;
    try {
      const pointMember = await PointMemberModel.findOne({
        where: { phoneNumber },
        include: [
          {
            model: UserModel,
            as: "user",
          },
        ],
      });

      res.status(200).json({
        code: 0,
        data: pointMember,
        message: "Lấy khách hàng thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /customers/all
  async all(req, res) {
    try {
      const { roleId } = req.query;
      const whereCondition = {
        status: false,
        roleId: { [Op.not]: [1, 2, 3] },
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
          {
            model: PointMemberModel,
            as: "pointMember",
            attributes: ["value", "phoneNumber"],
          },
        ],
      });

      const formattedUsers = users.map((user) => {
        const userData = user.get({ plain: true });
        return {
          ...userData,
          roleName: userData.role ? userData.role.roleName : null,
          pointMemberValue: userData.pointMember
            ? userData.pointMember.value
            : 0,
          phoneNumber: userData.pointMember
            ? userData.pointMember.phoneNumber
            : "Chưa có",
        };
      });

      res.status(200).json({
        code: 0,
        data: formattedUsers,
        message: "Lấy danh sách khách hàng thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  // [GET] /customers/:id
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
            model: PointMemberModel,
            as: "pointMember",
            attributes: ["phoneNumber"],
          },
        ],
      });

      if (user) {
        const userData = user.get({ plain: true });
        const formattedUser = {
          ...userData,
          roleName: userData.role ? userData.role.roleName : null,
          phoneNumber: userData.pointMember
            ? userData.pointMember.phoneNumber
            : null,
        };
        res.status(200).json({
          code: 0,
          data: formattedUser,
          message: "Tìm khách hàng thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Khách hàng không tồn tại",
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

  // [POST] /customers
  async store(req, res) {
    const { fullName, email, gender, dob, phoneNumber } = req.body;
    try {
      const user = await UserModel.findOne({
        where: { email, roleId: 4, status: false },
      });

      const pointMember = await PointMemberModel.findOne({
        where: { phoneNumber, status: false },
      });

      if (user) {
        return res.status(200).json({
          code: 1,
          message: "Email đã tồn tại!",
        });
      }
      if (pointMember) {
        const useWithPoint = await UserModel.findOne({
          where: { pointMemberId: pointMember?.id },
        });

        if (useWithPoint) {
          return res.status(200).json({
            code: 1,
            message: "Số điện thoại đã tồn tại",
          });
        }
      }

      const data = {
        fullName,
        gender,
        roleId: 4,
      };

      if (dob) {
        data.dob = dob;
      }

      if (email) {
        data.email = email;
      } else {
        data.email = "Không có";
      }

      if (pointMember) {
        data.pointMemberId = pointMember.id;
      } else {
        const { id } = await PointMemberModel.create({
          phoneNumber,
          email,
          fullName,
          value: 0,
        });
        data.pointMemberId = id;
      }

      const newUser = await UserModel.create(data);

      if (newUser) {
        res.status(201).json({
          code: 0,
          data: newUser,
          message: "Tạo khách hàng thành công",
        });
      } else {
        res.status(400).json({
          code: 1,
          message: "Tạo khách hàng thất bại",
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

  // [PUT] /customers/:id
  async update(req, res) {
    const { id } = req.params;
    const { fullName, email, gender, dob, phoneNumber } = req.body;
    try {
      const user = await UserModel.findOne({
        where: { id, status: false },
        include: [{ model: PointMemberModel, as: "pointMember" }],
      });

      const checkEmail = await UserModel.findOne({
        where: {
          email,
          id: {
            [Op.ne]: id,
          },
          roleId: 4,
        },
        status: false,
      });

      if (checkEmail) {
        return res.status(200).json({
          code: 1,
          message: "Email đã tồn tại",
        });
      }

      const checkPhoneNumber = await UserModel.findOne({
        where: {
          id: {
            [Op.ne]: id,
          },
          status: false,
        },
        include: [
          {
            model: PointMemberModel,
            as: "pointMember",
            where: { phoneNumber },
          },
        ],
      });

      if (checkPhoneNumber && checkPhoneNumber.pointMember) {
        return res.status(200).json({
          code: 1,
          message: "Số điện thoại đã tồn tại",
        });
      }

      if (user) {
        await PointMemberModel.update(
          { phoneNumber },
          {
            where: {
              id: user.pointMemberId,
            },
          }
        );
        await user.update({
          fullName,
          email,
          gender,
          dob,
          roleId: 4,
        });
        res.status(200).json({
          code: 0,
          message: "Cập nhật khách hàng thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Khách hàng không tồn tại",
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

  // [DELETE] /customers/:id
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
          message: "Xóa khách hàng thành công",
        });
      } else {
        res.status(404).json({
          code: 1,
          message: "Khách hàng không tồn tại",
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

export default new CustomerController();
