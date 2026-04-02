import { NextResponse } from "next/server";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/products";
import { prisma } from "@/lib/database";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If ID exists → return single product
    if (id) {
      const product = await getProductById(id);

      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data: product,
      });
    }

    // Otherwise return all products
    const products = await getProducts();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.description || data.price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, description, and price are required",
        },
        { status: 400 },
      );
    }

    // Validate stock
    const stock = data.stock !== undefined ? parseInt(data.stock) : 0;
    if (isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid stock value" },
        { status: 400 },
      );
    }

    // Get image URL, use first image from array or placeholder
    const imageUrl =
      data.images && Array.isArray(data.images) && data.images.length > 0
        ? data.images[0]
        : "/uploads/products/placeholder-product.jpg";

    const product = await createProduct({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: imageUrl,
      stock: stock,
    });

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Failed to add product:", error);

    return NextResponse.json(
      { success: false, error: "Failed to add product" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.description || data.price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, description, and price are required",
        },
        { status: 400 },
      );
    }

    // Get image URL, use first image from array or fallback to existing/placeholder
    const imageUrl =
      data.images && Array.isArray(data.images) && data.images.length > 0
        ? data.images[0]
        : "/uploads/products/placeholder-product.jpg";

    const product = await updateProduct(id, {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: imageUrl,
      stock: data.stock !== undefined ? parseInt(data.stock) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Failed to update product:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check if product has any associated orders
    const ordersWithProduct = await prisma.orderItem.findMany({
      where: { productId: id },
    });

    if (ordersWithProduct.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete product that has associated orders",
        },
        { status: 400 },
      );
    }

    await deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete product:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
