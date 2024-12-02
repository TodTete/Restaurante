//Creado por: Ricardo Vallejo Sánchez
//Vallejoricardo3@gmail.com
// 249-210-8702

import express from "express";
import { PORT } from "./config.js";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import SalesRouter from "./routes/sales.routes.js";
import IndexRouter from "./routes/index.routes.js";

const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

app.use(IndexRouter);
app.use(SalesRouter);

app.listen(PORT, () => {
  console.log("listening on ", PORT);
});
