import { PrismaClient } from "../server/generated";

const prisma = new PrismaClient();

async function main() {
	// Seed data for products
	const products = [
		{ name: "Laptop" },
		{ name: "Smartphone" },
		{ name: "Headphones" },
		{ name: "Keyboard" },
		{ name: "Mouse" },
	];

	for (const product of products) {
		await prisma.product.create({
			data: product,
		});
	}

	console.log("Seeding completed!");
}

main();
