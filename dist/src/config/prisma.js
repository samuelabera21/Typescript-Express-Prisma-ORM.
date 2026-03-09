"use strict";
// import { PrismaClient } from "@prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
// const prisma = new PrismaClient();
// export default prisma;
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
