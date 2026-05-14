import { DataSource } from "typeorm";
import { User } from "./user/entity/user.entity";
import * as dotenv from 'dotenv';

dotenv.config();

export const postgresDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URI,
    migrations: [__dirname + '/migration/*.{ts,js}'],
    entities: [User],
    synchronize: false,
    ssl: {
        rejectUnauthorized: true
    }
})