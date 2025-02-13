import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        timezone: '+07:00',
    }
);

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
export { connect };
