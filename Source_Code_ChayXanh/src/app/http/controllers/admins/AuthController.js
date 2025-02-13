import { UserModel, StoreModel, BelongStoreModel } from "../../../models";
import { Op } from "sequelize";

class AuthController {
  // [GET] /admin/login
  index(req, res) {
    res.render("admins/pages/auth/login", {
      layout: "admins/layouts/empty-layout",
      title: "Đăng nhập",
    });
  }

  // [GET] /admin/choiceStore
  async choiceStore(req, res) {
    const user = req.session.user;

    // User
    if (user.roleId == 2) {
      const store = await StoreModel.findOne({
        where: { managedBy: user.id },
      });

      req.session.store = store;
      res.redirect("/admin/");
      return;
    }

    // Staff
    if (user.roleId == 3) {
      const belongsTo = await BelongStoreModel.findOne({
        where: { userId: user.id },
      });

      const store = await StoreModel.findOne({
        where: { id: belongsTo.storeId },
      });
      req.session.store = store;
      res.redirect("/admin/");
      return;
    }

    // Get store by admin
    let stores = await StoreModel.findAll({ where: { status: 0 } });
    const store = req.session.store;

    // Convert data
    let simplifiedStores = stores.map((store) => store.get({ plain: true }));

    res.render("admins/pages/auth/choiceStore", {
      layout: "admins/layouts/empty-layout",
      title: "Chọn cửa hàng",
      stores,
      store,
    });
  }

  // [POST] /admin/save-choice-store
  async saveChoiceStore(req, res) {
    try {
      const { id } = req.params;
      const store = await StoreModel.findOne({ where: { id } });
      req.session.store = store;

      res.status(200).json({
        code: 0,
        store,
        message: "Lưu cửa hàng thành công",
      });
    } catch (error) {
      res.status(500).json({
        code: 2,
        message: `Lỗi server ${error}`,
      });
    }
  }

  // [POST] /admin/signup
  async signup(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({
        where: { email, status: false, roleId: { [Op.not]: [4] } },
      });
      if (!user) {
        return res.status(200).json({
          code: 1,
          message: "Email không tồn tại",
        });
      }
      const isCorrect = await user.isCorrectPassword(password);
      if (!isCorrect) {
        return res.status(200).json({
          code: 1,
          message: "Mật khẩu không chính xác",
        });
      }

      req.session.user = user;
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

  // [GET] /admin/logout
  logout(req, res) {
    delete req.session.user;
    delete req.session.store;
    res.redirect("/admin/login");
  }

  async changePassword(req, res) {
    const { password, newPassword, newPassword_r } = req.body;

    try {
      if (newPassword != newPassword_r) {
        return res.status(200).json({
          code: 1,
          message: `Mật khẩu nhập lại không chính xác`,
        });
      }

      const { id } = req.session.user;
      const user = await UserModel.findOne({ where: { id } });
      const isCorrectPassword = user.isCorrectPassword(password);
      if (!isCorrectPassword) {
        return res.status(200).json({
          code: 1,
          message: `Mật khẩu không chính xác`,
        });
      }

      // Save new password
      await user.update({ password });

      return res.status(200).json({
        code: 0,
        message: `Đổi mật khẩu thành công`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 2,
        message: `Lỗi server ${error}`,
      });
    }
  }
}

export default new AuthController();
