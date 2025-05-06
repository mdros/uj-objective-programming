import { create } from "zustand";

interface CartStore {
	productIds: number[];
	toggleProductId: (productId: number) => void;
	clearCart: () => void;
}

const useCartStore = create<CartStore>()((set) => ({
	productIds: [],
	toggleProductId: (productId) =>
		set((state) => ({
			productIds: state.productIds.includes(productId)
				? state.productIds.filter((id) => id !== productId)
				: [...state.productIds, productId],
		})),
	clearCart: () =>
		set(() => ({
			productIds: [],
		})),
}));

export { useCartStore };
