//Creado por: Ricardo Vallejo Sánchez
//Vallejoricardo3@gmail.com
// 249-210-8702

import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const [existingUser] = await pool.query(
      "SELECT * FROM user WHERE name = ?",
      [name]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO user (name, password) VALUES (?, ?)",
      [name, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      id: result.insertId,
      name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM user");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM user WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar usuario", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required" });
    }

    const [user] = await pool.query("SELECT * FROM user WHERE name = ?", [
      name,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let attempts = 0;
    const maxAttempts = 5;
    if (attempts >= maxAttempts) {
      return res
        .status(429)
        .json({ message: "Too many failed attempts. Try again later." });
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM unifiedsales ORDER BY date ASC"
    );
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error obteniendo las ventas", error: error.message });
  }
};

export const getTables = async (req, res) => {
  try {
    const [tables] = await pool.query("SELECT * FROM tables");
    res.json(tables);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tables", error: error.message });
  }
};

export const getLowStockArticles = async (req, res) => {
  try {
    const [articles] = await db.query(
      "SELECT name, stock FROM articles WHERE stock < 10"
    );
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticles = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM articles ORDER BY idArticle ASC"
    );
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting articles", error: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res
        .status(400)
        .json({ message: "Name, price, and stock are required" });
    }
    const [result] = await pool.query(
      "INSERT INTO articles (name, price, stock) VALUES (?, ?, ?)",
      [name, price, stock]
    );

    res.status(201).json({
      idArticle: result.insertId,
      name,
      price,
      stock,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating article", error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name && !price && stock === undefined) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }
    const [result] = await pool.query(
      "UPDATE articles SET ? WHERE idArticle = ?",
      [req.body, req.params.idArticle]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({ message: "Article updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating article", error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM articles WHERE idArticle = ?",
      [req.params.idArticle]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting article", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT uo.idOrder, uo.idTable, uo.date, uo.state, uo.description, 
             uo.quantity, uo.comments, uo.idArticle, a.name AS articleName
      FROM unifiedorders uo
      JOIN articles a ON uo.idArticle = a.idArticle
      ORDER BY uo.date ASC
    `);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const ordersWithDetails = orders.reduce((acc, row) => {
      const {
        idOrder,
        idTable,
        date,
        state,
        description,
        quantity,
        comments,
        articleName,
      } = row;

      const order = acc.find((o) => o.idOrder === idOrder);

      const detail = {
        quantity,
        comments,
        item: articleName, // Cambia `idArticle` a `articleName`
      };

      if (order) {
        order.details.push(detail);
      } else {
        acc.push({
          idOrder,
          idTable,
          date,
          state,
          description,
          details: [detail],
        });
      }
      return acc;
    }, []);

    res.json(ordersWithDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error obteniendo los pedidos", error: error.message });
  }
};

export const createOrder = async (req, res) => {
  const { table_id, items, description = "" } = req.body;

  // Validación de datos requeridos
  if (!table_id || !items || items.length === 0) {
    return res.status(400).json({ message: "Faltan datos requeridos." });
  }

  try {
    // Creación de registros de la orden con estado "sin_atender"
    const orderEntries = items.map((item) => [
      table_id,
      new Date(),
      "sin_atender", // Estado por defecto
      description,
      item.idArticle,
      item.quantity,
      item.comments || "",
    ]);

    // Inserción en la tabla 'unifiedorders'
    const insertOrderQuery = `
      INSERT INTO unifiedorders (idTable, date, state, description, idArticle, quantity, comments)
      VALUES ?
    `;

    const [insertResult] = await pool.query(insertOrderQuery, [orderEntries]);

    // Actualización del estado de la mesa a "ocupada"
    const updateTableStatusQuery = `
      UPDATE tables 
      SET status = 'occupied' 
      WHERE idTable = ?
    `;

    await pool.query(updateTableStatusQuery, [table_id]);

    // Respuesta con detalles de la orden creada
    res.status(201).json({
      message: "Orden creada con éxito y mesa actualizada a ocupada",
      order: {
        table_id,
        date: new Date(),
        state: "sin_atender",
        description,
        items: items.map((item) => ({
          idArticle: item.idArticle,
          quantity: item.quantity,
          comments: item.comments || "",
        })),
      },
    });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res
      .status(500)
      .json({ message: "Error al crear la orden", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { idOrder } = req.params;
    const [result] = await pool.query(
      "DELETE FROM unifiedorders WHERE idOrder = ?",
      [idOrder]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { idOrder } = req.params;
    const { state } = req.body;

    if (!state) {
      return res
        .status(400)
        .json({ message: "The state field is required to update" });
    }

    const [result] = await pool.query(
      "UPDATE unifiedorders SET state = ? WHERE idOrder = ?",
      [state, idOrder]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

export const finalizeTableSale = async (req, res) => {
  const { tableId } = req.params;

  try {
    // Verificar el estado de la mesa
    const [tableResult] = await pool.query(
      "SELECT status FROM tables WHERE idTable = ?",
      [tableId]
    );

    if (tableResult.length === 0) {
      return res.status(404).json({ message: "La mesa no existe." });
    }

    const tableStatus = tableResult[0].status;

    if (tableStatus !== "occupied") {
      return res.status(400).json({ message: "La mesa no está ocupada." });
    }

    // Verificar si todas las órdenes están completadas
    const [ordersResult] = await pool.query(
      "SELECT * FROM unifiedorders WHERE idTable = ? AND state != 'completado'",
      [tableId]
    );

    if (ordersResult.length > 0) {
      return res.status(400).json({
        message: "Hay órdenes pendientes que no están completadas.",
      });
    }

    // Calcular el total sumando el precio de cada artículo en unifiedorders
    const [totalResult] = await pool.query(
      `SELECT SUM(uo.quantity * uo.unitPrice) AS total
      FROM unifiedorders uo
      WHERE uo.idTable = ? AND uo.state = 'completado'`,
      [tableId]
    );

    const total = totalResult[0].total || 0;

    // Cambiar el estado de la mesa a 'available'
    await pool.query(
      "UPDATE tables SET status = 'available' WHERE idTable = ?",
      [tableId]
    );

    // Registrar la venta en unifiedsales
    const [orders] = await pool.query(
      "SELECT uo.idArticle, uo.quantity, uo.unitPrice, a.name FROM unifiedorders uo JOIN articles a ON uo.idArticle = a.idArticle WHERE uo.idTable = ? AND uo.state = 'completado'",
      [tableId]
    );

    for (const order of orders) {
      await pool.query(
        "INSERT INTO unifiedsales (idTable, idArticle, nameArticle, quantity, unitPrice, date, payAmount) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
        [
          tableId,
          order.idArticle,
          order.name, // Nombre del artículo obtenido desde la tabla 'articles'
          order.quantity,
          order.unitPrice,
          total, // Total general de la mesa
        ]
      );
    }

    // Responder con éxito
    res.json({
      message: "Cuenta finalizada con éxito.",
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Hubo un error al intentar realizar la cuenta de la mesa.",
    });
  }
};


export const getDailySalesTotal = async (req, res) => {
  try {
    const { saleDate } = req.query;
    const [result] = await pool.query(
      "CALL daily_sales_total(?, @totalSales); SELECT @totalSales AS totalSales;",
      [saleDate]
    );
    res.json(result[1][0].totalSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentOrdersSummary = async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT state, COUNT(*) AS total FROM unifiedorders WHERE state IN ('sin_atender', 'en_espera') GROUP BY state"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTableStatus = async (req, res) => {
  try {
    const [tables] = await pool.query(`
      SELECT 
        t.idTable,
        t.number,
        t.status AS tableStatus,
        uo.idOrder,
        uo.state AS orderState,
        uo.description,
        a.price AS unitPrice
      FROM tables t
      LEFT JOIN unifiedorders uo ON t.idTable = uo.idTable
      LEFT JOIN articles a ON uo.idArticle = a.idArticle
      GROUP BY t.idTable, t.number, t.status, uo.idOrder, uo.state, uo.description, a.price;
    `);

    const mesas = tables.reduce((acc, row) => {
      const mesa = acc.find((m) => m.idTable === row.idTable);
      const pedido = {
        idOrder: row.idOrder,
        state: row.orderState,
        description: row.description,
      };

      if (mesa) {
        mesa.pedidos.push(pedido);
      } else {
        acc.push({
          idTable: row.idTable,
          number: row.number,
          status: row.tableStatus,
          pedidos: [pedido],
        });
      }
      return acc;
    }, []);

    res.json(mesas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el estado de las mesas",
      error: error.message,
    });
  }
};

export const createSale = async (req, res) => {
  try {
    const { total, pay } = req.body;

    if (total === undefined || pay === undefined) {
      return res.status(400).json({ message: "Total y pago son requeridos." });
    }
    if (pay < total) {
      return res
        .status(400)
        .json({ message: "El pago no puede ser menor al total." });
    }

    const change = pay - total;

    const [result] = await pool.query(
      "INSERT INTO unifiedsales (date, total, payAmount, changeAmount) VALUES (NOW(), ?, ?, ?)",
      [total, pay, change]
    );

    res.status(201).json({
      message: "Venta creada con éxito.",
      saleId: result.insertId,
      total,
      pay,
      change,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la venta.",
      error: error.message,
    });
  }
};

export const getDetailSales = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM unifiedsales WHERE idSale = ?",
      [req.params.idSale]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting sale details", error: error.message });
  }
};
