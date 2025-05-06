import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="p-4 flex gap-6">
				<Link to="/" className="[&.active]:font-bold text-lg hover:underline">
					Home
				</Link>
				<Link
					to="/cart"
					className="[&.active]:font-bold text-xl hover:underline"
				>
					Cart
				</Link>
				<Link
					to="/orders"
					className="[&.active]:font-bold text-xl hover:underline"
				>
					Orders
				</Link>
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
