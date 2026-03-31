import { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface ShopContextType {
  cart: Product[];
  wishlist: Product[];
  compare: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  toggleCompare: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
  isInCompare: (id: number) => boolean;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext<ShopContextType | null>(null);

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be inside ShopProvider");
  return ctx;
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const toggleCompare = (product: Product) => {
    setCompare((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : prev.length >= 4 ? prev : [...prev, product]
    );
  };

  const isInWishlist = (id: number) => wishlist.some((p) => p.id === id);
  const isInCompare = (id: number) => compare.some((p) => p.id === id);

  const cartTotal = cart.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);
  const cartCount = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);

  return (
    <ShopContext.Provider
      value={{
        cart, wishlist, compare,
        addToCart, removeFromCart, updateCartQuantity,
        toggleWishlist, toggleCompare,
        isInWishlist, isInCompare,
        cartTotal, cartCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
