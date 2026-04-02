"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Product } from "@/types";
import { Card, CardBody, Button, Badge } from "@/components/common";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    // Show success feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Card
      hoverable
      onClick={() => router.push(`/products/${product.id}`)}
      className="flex flex-col h-full"
    >
      <CardBody className="flex-1 flex flex-col">
        {/* Product Image */}
        <div className="aspect-square w-full bg-slate-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl">📦</div>
          )}
        </div>

        {/* Product Info */}
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="mt-3 flex items-center justify-between">
          <Badge variant={product.stock > 0 ? "success" : "danger"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
          <span className="text-xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          variant={
            isAdded ? "success" : product.stock > 0 ? "primary" : "secondary"
          }
          className={`mt-4 w-full transition-all duration-300 transform ${
            product.stock > 0 ? "hover:scale-105 hover:shadow-lg" : ""
          } ${isAdded ? "ring-2 ring-green-400" : ""}`}
        >
          {isAdded
            ? "✓ Added to Cart"
            : product.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
        </Button>
      </CardBody>
    </Card>
  );
};
