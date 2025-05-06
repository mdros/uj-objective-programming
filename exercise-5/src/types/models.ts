export type Payment = {
	id: number;
	orderId: number;
};

export type Product = {
	id: number;
	name: string;
};

export type Order = {
	id: number;
	products: Product[];
	payment?: Payment;
};
