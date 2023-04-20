import express from 'express';
import dotenv from 'dotenv';
import {DBUtil} from "./db/DBUtil";
import cors from 'cors';
import addressRouter from "./routers/address/addressRouter";
import cartRouter from "./routers/cart/cartRouter";
import categoriesRouter from "./routers/categories/categoriesRouter";
import ordersRouter from "./routers/orders/ordersRouter";
import productsRouter from "./routers/products/productsRouter";
import usersRouter from "./routers/users/usersRouter";

const app: express.Application = express(); // initialize the express js

// configure cors policy
app.use(cors());

// configure dot-env
dotenv.config({
    path: "./.env"
})
// configure express to read form data
app.use(express.json());

const port: number | undefined = Number(process.env.PORT) || 9000;
const host: string | undefined = process.env.host;
const dbUrl: string | undefined = process.env.EXPRESS_APP_MONGO_DB_CLOUD_URL;
const dbName: string | undefined = process.env.EXPRESS_APP_MONGO_DB_DATABASE_NAME;

app.get('/', (request: express.Request, response: express.Response) => {
    response.status(200);
    response.json({
        msg: 'Welcome to Express Server'
    });
})

// Router configuration
app.use('/api/users', usersRouter);

app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', ordersRouter);

if (port && dbUrl && dbName) {
    app.listen(port, () => {
        if (dbUrl && dbName) {
            DBUtil.connectToDB(dbUrl, dbName).then((dbResponse) => {
                console.log(dbResponse);
            }).catch((error) => {
                console.error(error);
                process.exit(0); // stops the node js process
            });
        }
        console.log(`Server started at http://${host}:${port}`);
    })
}