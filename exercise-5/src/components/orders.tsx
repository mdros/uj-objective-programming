import { BASE_API_URL } from "@/src/constants";
import type { Order } from "@/src/types/models";
import { useQuery } from "@tanstack/react-query";

export default function Orders() {
	const {
		data: orders,
		isPending,
		isError,
	} = useQuery<Order[]>({
		queryKey: ["orders"],
		queryFn: () => fetch(`${BASE_API_URL}/orders`).then((res) => res.json()),
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading orders</div>;
	}
	
	return (
		<>
			<h1 className="text-2xl font-bold mb-4 text-center">Orders</h1>
			<ul className="flex flex-col gap-4">
				{orders.map((order) => (
					<div
						key={order.id}
						className="flex flex-col border rounded-lg p-4 shadow hover:shadow-xl transition-shadow"
					>
						<span className="text-lg font-medium text-gray-800">
							Order id: {order.id}
						</span>
						<span className="text-lg font-medium text-gray-800">
							Product ids in this order:{" "}
							{(order.products.map((p) => p.name) ?? []).join(", ")}
						</span>
					</div>
				))}
			</ul>
		</>
	);
}
