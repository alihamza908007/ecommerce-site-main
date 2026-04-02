import 'server-only';
import { prisma } from './database';
import type { Product } from '@prisma/client';

export type { Product };

export type ProductWithReviewStats = Product & {
  averageRating: number;
  totalReviews: number;
};

async function attachReviewStats(products: Product[]): Promise<ProductWithReviewStats[]> {
  const ids = products.map((p) => p.id);

  const reviewStats = await prisma.productReview.groupBy({
    by: ['productId'],
    where: { productId: { in: ids } },
    _avg: { rating: true },
    _count: { id: true },
  });

  const statsMap = new Map(
    reviewStats.map((s) => [
      s.productId,
      {
        averageRating: Math.round((s._avg.rating ?? 0) * 10) / 10,
        totalReviews: s._count.id,
      },
    ])
  );

  return products.map((p) => ({
    ...p,
    averageRating: statsMap.get(p.id)?.averageRating ?? 0,
    totalReviews: statsMap.get(p.id)?.totalReviews ?? 0,
  }));
}

export async function getProducts(): Promise<ProductWithReviewStats[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return attachReviewStats(products);
}

export async function getProductById(id: string): Promise<ProductWithReviewStats | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  const [enriched] = await attachReviewStats([product]);
  return enriched;
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}): Promise<Product> {
  return await prisma.product.create({
    data,
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
  }>
): Promise<Product> {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string): Promise<Product> {
  return await prisma.product.delete({
    where: { id },
  });
}

export async function updateStock(
  id: string,
  stock: number
): Promise<Product> {
  return await prisma.product.update({
    where: { id },
    data: { stock },
  });
}