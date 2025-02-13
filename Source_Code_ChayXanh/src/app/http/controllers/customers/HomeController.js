const FOLDER_NAME = "customers/pages/homes";
const MAIN_LAYOUT = "customers/layouts/main-layout";
const TITLE = "Trang chủ";

import { VoucherModel, OrderModel } from "../../../models";

class HomeController {
  async index(req, res) {
    try {
      const vouchers = await VoucherModel.findAll({
        where: { status: false },
      });

      res.render(`${FOLDER_NAME}/index`, {
        title: TITLE,
        layout: MAIN_LAYOUT,
        vouchers,
      });
    } catch (error) {
      console.log(error);
      res.render(`${FOLDER_NAME}/index`, {
        title: TITLE,
        layout: MAIN_LAYOUT,
        vouchers: [],
      });
    }
  }
}

module.exports = new HomeController();
