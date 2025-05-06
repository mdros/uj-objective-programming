import { BASE_API_URL } from "@/src/constants";
import { useCartStore } from "@/src/store";
import type { Product } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export default function Products() {
	const productIds = useCartStore((state) => state.productIds);
	const toggleProductId = useCartStore((state) => state.toggleProductId);
;
	const {
		data: products,
		isPending,
		isError,
	} = useQuery<Product[]>({
		queryKey: ["products"],
		queryFn: () => fetch(`${BASE_API_URL}/products`).then((res) => res.json()),
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading products</div>;
	}

	return (
		<div className="p-4">
			<span className="text-2xl font-bold mb-4 text-center">
				Products in cart: {productIds.map((id) => id).join(", ")}
			</span>
			<h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
			<ul className="flex flex-col gap-4">
				{products.map((product) => (
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
							{productIds.includes(product.id)
								? "Remove from cart"
								: "Add to cart"}
						</button>
					</div>
				))}
			</ul>
		</div>
	);
}
