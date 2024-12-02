//Creado por: Ricardo Vallejo Sánchez
//Vallejoricardo3@gmail.com
// 249-210-8702

import { Router } from "express";
import { createUser, getTables, createOrder, getLowStockArticles,getCurrentOrdersSummary,getDailySalesTotal,updateOrder, deleteUser, getOrders, getUsers, loginUser, getSales, createSale,  getArticles, createArticle, updateArticle, deleteArticle, getDetailSales, getTableStatus,  finalizeTableSale ,} from "../controllers/sales.controllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/users", createUser);
router.post("/login", loginUser);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

router.get("/tables/status", getTableStatus);
router.post("/tables/:tableId/finalize", finalizeTableSale);

// Rutas de ventas
router.get("/sales", getSales);
router.post("/sales", createSale);

router.get("/articles", getArticles);
router.post("/articles", createArticle);
router.put("/articles/:idArticle", updateArticle);
router.delete("/articles/:idArticle", deleteArticle);

router.get("/sales/:idSale/details", getDetailSales);
router.get("/tables", getTables);

router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.put("/orders/:idOrder", updateOrder);


export default router;