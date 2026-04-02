import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/database";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> },
) {
  try {
    const { id: productId, reviewId } = await params;

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

    // Get the specific review
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    // Verify that the review belongs to this product
    if (review.productId !== productId) {
      return NextResponse.json(
        { success: false, error: "Review does not belong to this product" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Failed to fetch review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch review" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> },
) {
  try {
    const { id: productId, reviewId } = await params;
    const session = await getSessionFromRequest(request);

    // Check if user is authenticated
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get the review
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    // Check if user is the review author or admin
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (review.userId !== session.id && user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "You can only delete your own reviews" },
        { status: 403 },
      );
    }

    // Delete the review
    await prisma.productReview.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> },
) {
  try {
    const { id: productId, reviewId } = await params;
    const session = await getSessionFromRequest(request);

    // Check if user is authenticated
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get the review
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    // Check if user is the review author
    if (review.userId !== session.id) {
      return NextResponse.json(
        { success: false, error: "You can only edit your own reviews" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { rating, reviewText } = body;

    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (reviewText && reviewText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Review text cannot be empty" },
        { status: 400 },
      );
    }

    // Update the review
    const updatedReview = await prisma.productReview.update({
      where: { id: reviewId },
      data: {
        ...(rating && { rating: Math.round(rating) }),
        ...(reviewText && { reviewText: reviewText.trim() }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 },
    );
  }
}
