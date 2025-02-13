## Giới thiệu

Dự án **Restaurant Chain** là một hệ thống quản lý chuỗi nhà hàng. Hướng dẫn này sẽ giúp bạn cài đặt và chạy dự án trên máy của mình.

## Yêu cầu hệ thống

-   **Node.js** phiên bản 14.x hoặc cao hơn.
-   **MySQL** phiên bản 5.7 hoặc cao hơn.
-   **Git** để quản lý mã nguồn.

## Bước 1: Clone repository

Để bắt đầu, bạn cần clone mã nguồn từ GitHub:

```bash
git clone https://github.com/vdtien2908/restaurant-chain-21082024.git
cd restaurant-chain-21082024

cp .env-example .env

CREATE DATABASE restaurant_chain;

npx sequelize-cli db:migrate

npx sequelize-cli db:seed:all

npm run dev
```
