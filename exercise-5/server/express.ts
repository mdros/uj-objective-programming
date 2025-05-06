import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { PrismaClient } from "./generated";

const prisma = new PrismaClient();
const app = express();
const jsonParser = bodyParser.json();
const whitelist = ["http://localhost:5173"];

app.use(
	cors({
		origin: whitelist,
	}),
);

app.get("/products", async (req, res) => {
	try {
		const products = await prisma.product.findMany();
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch products" });
	}
});

app.get("/orders", async (req, res) => {
	try {
		const orders = await prisma.order.findMany({
			include: { products: true, payment: true },
		});
		res.json(orders);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch orders" });
	}
});

app.get("/payments", async (req, res) => {
	try {
		const payments = await prisma.payment.findMany({
			include: { order: true },
		});
		res.json(payments);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch payments" });
	}
});

app.post("/orders", jsonParser, async (req, res) => {
	console.log("Received request to create order");
	console.log("Request body:", req.body);
	try {
		const { productIds } = req.body;
		console.log("Received product ids:", productIds);

		if (!Array.isArray(productIds) || productIds.length === 0) {
			res.status(400).json({ error: "Invalid product ids" });
			return;
		}

		const order = await prisma.order.create({
			data: {
				products: {
					connect: productIds.map((id: number) => ({ id })),
				},
				payment: {
					create: {}, // Automatically create a payment for the order
				},
			},
			include: {
				payment: true, // Include the payment in the response
			},
		});

		console.log("Order created with payment:", order);

		const { payment } = order; // Extract the payment from the created order

		res.status(201).json({ order, payment });
	} catch (error) {
		res.status(500).json({ error: "Failed to create order and payment" });
	}
});

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
