import express from "express";
const app = express();
import cors from "cors";
const port = process.env.PORT || 10000;
import indexRoute from "./router/router.js"

app.use(cors({
    origin: 'https://tharunjp.github.io/document/',  
    methods: ['GET', 'POST','PUT','PATCH','DELETE'],
    credentials: true,
  }));
app.use(express.json());

app.use("/",indexRoute)


app.listen(port,()=>console.log(`The app is running in ${port}`))