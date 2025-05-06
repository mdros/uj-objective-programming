import { BASE_API_URL } from "@/src/constants";
import { useCartStore } from "@/src/store";
import type { Product } from "@/src/types/models";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
	component: Cart,
});

function Cart() {
	const productIds = useCartStore((state) => state.productIds);
	const toggleProductId = useCartStore((state) => state.toggleProductId);
	const clearCart = useCartStore((state) => state.clearCart);

	const {
		data: products,
		isPending,
		isError,
	} = useQuery<Product[]>({
		queryKey: ["products"],
		queryFn: () => fetch(`${BASE_API_URL}/products`).then((res) => res.json()),
	});

	const { mutate } = useMutation({
		mutationFn: (productIds: number[]) =>
			fetch(`${BASE_API_URL}/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ productIds }),
			}).then((res) => {
				if (!res.ok) {
					throw new Error("Failed to create order and payment");
				}
				return res.json();
			}),
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading cart products</div>;
	}

	const cartProducts = products.filter((product) =>
		productIds.includes(product.id),
	);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4 text-center">Your Cart</h1>
			{cartProducts.length === 0 ? (
				<div className="text-center text-lg">Your cart is empty.</div>
			) : (
				<ul className="flex flex-col gap-4">
					{cartProducts.map((product) => (
						<div
							key={product.id}
							className="flex justify-between items-center border rounded-lg p-4 shadow hover:shadow-xl transition-shadow"
						>
							<span className="text-lg font-medium text-gray-800">
								{product.name}
							</span>
							<button
								type="button"
								className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 transition-colors cursor-pointer"
								onClick={() => toggleProductId(product.id)}
							>
								Remove from cart
							</button>
						</div>
					))}
				</ul>
			)}
			{cartProducts.length > 0 && (
				<div className="mt-4 text-center">
					<button
						type="button"
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors cursor-pointer"
						onClick={() => {
							alert("Creating order and payment...");
							console.log(productIds);
							mutate(productIds);
							clearCart();
						}}
					>
						Pay
					</button>
				</div>
			)}
		</div>
	);
}
