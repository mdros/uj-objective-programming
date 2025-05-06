import Orders from "@/src/components/orders";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/orders")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-4">
			<Orders />
		</div>
	);
}
