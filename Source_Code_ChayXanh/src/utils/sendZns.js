require("dotenv").config();
const axios = require("axios");

const sendZNS = async (data) => {
  const API_URL = "https://business.openapi.zalo.me/message/template";
  const ACCESS_TOKEN = process.env.ZNS_ACCESS_TOKEN;

  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        access_token: ACCESS_TOKEN,
      },
    });

    if (response.data.error === 0) {
      console.log("Gửi ZNS thành công:", response.data);
    } else {
      console.log("Gửi ZNS thất bại:", response.data);
    }
  } catch (error) {
    console.error(
      "Lỗi khi gửi ZNS:",
      error.response ? error.response.data : error.message
    );
  }
};
module.exports = sendZNS;
