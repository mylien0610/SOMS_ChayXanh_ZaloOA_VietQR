import { UserModel, PointMemberModel, OrderModel } from "../../../models";
import { Op } from "sequelize";
import sendEmail from "../../../../utils/sendEmail";

const FOLDER_NAME = "customers/pages/auth";
const MAIN_LAYOUT = "customers/layouts/main-layout";
const TITLE = "Đăng nhập";

class AuthController {
  login(req, res) {
    res.render(`${FOLDER_NAME}/login`, {
      title: TITLE,
      layout: MAIN_LAYOUT,
    });
  }

  register(req, res) {
    res.render(`${FOLDER_NAME}/register`, {
      title: "Đăng ký",
      layout: MAIN_LAYOUT,
    });
  }

  async signup(req, res) {
    const { fullName, email, phoneNumber, dob, gender, password } = req.body;
    try {
      const user = await UserModel.findOne({
        where: { email, roleId: 4, status: false },
      });

      const pointMember = await PointMemberModel.findOne({
        where: { phoneNumber, status: false },
      });

      if (user && user.password) {
        return res.status(200).json({
          code: 1,
          message: "Email đã tồn tại!",
        });
      }
      if (pointMember) {
        const useWithPoint = await UserModel.findOne({
          where: { pointMemberId: pointMember?.id },
        });

        if (useWithPoint && useWithPoint.password) {
          return res.status(200).json({
            code: 1,
            message: "Số điện thoại đã tồn tại",
          });
        }
      }

      const data = { fullName, email, dob, gender, password, roleId: 4 };
      if (pointMember) {
        data.pointMemberId = pointMember.id;
      } else {
        const newPointMember = await PointMemberModel.create({
          phoneNumber,
          value: 0,
        });
        data.pointMemberId = newPointMember.id;
      }

      if (user?.fullName) {
        await user.update(data);
      } else {
        await UserModel.create(data);
      }
      res.status(200).json({
        code: 0,
        message: "Đăng ký tài khoản thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: "Lỗi server",
      });
    }
  }

  async submitLogin(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({
        where: { email, status: false, roleId: { [Op.not]: [1, 2, 3] } },
      });
      if (!user) {
        return res.status(200).json({
          code: 1,
          message: "Email chưa được đăng ký",
        });
      }
      const isCorrect = await user.isCorrectPassword(password);
      if (!isCorrect) {
        return res.status(200).json({
          code: 1,
          message: "Mật khẩu không chính xác",
        });
      }

      req.session.customer = user;

      res.status(200).json({
        code: 0,
        message: "Đăng nhập thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: `Lỗi server ${error}`,
      });
    }
  }

  forgotPassword(req, res) {
    res.render(`${FOLDER_NAME}/forgot-password`, {
      title: "Quên mật khẩu",
      layout: MAIN_LAYOUT,
    });
  }

  async submitForgotPassword(req, res) {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(200).json({
        code: 1,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    try {
      const pointMember = await PointMemberModel.findOne({
        where: {
          phoneNumber,
        },
      });

      if (!pointMember) {
        return res.status(200).json({
          code: 1,
          message: "Số điện thoại chưa được đăng ký",
        });
      }

      const user = await UserModel.findOne({
        where: {
          pointMemberId: pointMember.id,
        },
      });

      if (!user && !user.password) {
        return res.status(200).json({
          code: 1,
          message: "Số điện thoại chưa được đăng ký",
        });
      }

      const newPass = Math.floor(Math.random() * 1e10)
        .toString()
        .padStart(10, "0");

      // Send pass to email
      await sendEmail(
        user.email,
        "Lấy mật khẩu",
        `Mật khẩu mới của bạn là ${newPass}. Vui lòng không chia sẽ email này với bất kỳ ai khác.`
      );

      // Save new Pass
      await user.update({ password: newPass });

      res.status(200).json({
        code: 0,
        message: "Thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: `Lỗi server ${error}`,
      });
    }
  }

  // [GET] /logout
  logout(req, res) {
    delete req.session.customer;
    res.redirect("/login");
  }

  async profile(req, res) {
    try {
      const user = await UserModel.findOne({
        where: {
          id: req.session.customer.id,
        },
        include: [{ model: PointMemberModel, as: "pointMember" }],
      });

      const orders = await OrderModel.findAll({
        where: { phoneNumber: user.pointMember.phoneNumber },
      });

      res.render(`${FOLDER_NAME}/profile`, {
        title: "Thông tin cá nhân",
        layout: MAIN_LAYOUT,
        user,
        orders,
      });
    } catch (error) {
      console.log(error);
      res.render(`${FOLDER_NAME}/profile`, {
        title: "Thông tin cá nhân",
        layout: MAIN_LAYOUT,
      });
    }
  }
}

module.exports = new AuthController();
