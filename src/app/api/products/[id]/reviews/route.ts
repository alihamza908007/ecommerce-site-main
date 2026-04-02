import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/database";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await params;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    // Get all reviews for the product
    const reviews = await prisma.productReview.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await params;
    const session = await getSessionFromRequest(request);

    // Check if user is authenticated
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { rating, reviewText } = body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (!reviewText || reviewText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Review text cannot be empty" },
        { status: 400 },
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.productReview.findFirst({
      where: {
        productId,
        userId: session.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "You have already reviewed this product" },
        { status: 400 },
      );
    }

    // Create the review
    const review = await prisma.productReview.create({
      data: {
        productId,
        userId: session.id,
        rating: Math.round(rating),
        reviewText: reviewText.trim(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 },
    );
  }
}
