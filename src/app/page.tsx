"use client";

import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const bannerSlides = [
    {
      id: 1,
      icon: "🚀",
      title: "Cutting-Edge Technology",
      description:
        "Built on the latest tech stack with lightning-fast performance and seamless user experience.",
    },
    {
      id: 2,
      icon: "🚚",
      title: "Fast & Secure Shipping",
      description:
        "We ensure your orders arrive quickly and safely with industry-leading security protocols.",
    },
    {
      id: 3,
      icon: "💰",
      title: "Competitive Pricing",
      description:
        "Get the best value for your money with transparent pricing and no hidden fees.",
    },
  ];

  useEffect(() => {
    const { user } = getCurrentUser();
    if (user) {
      setCurrentUser({ name: user.name, role: user.role });
    }
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (isHovering) {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    } else {
      carouselIntervalRef.current = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % bannerSlides.length);
      }, 2000);
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [isHovering, bannerSlides.length]);

  const handlePrevSlide = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length,
    );
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % bannerSlides.length);
  };

  const handleDotClick = (index: number) => {
    setCarouselIndex(index);
  };

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch("/api/products?limit=6");
      const data = await response.json();
      if (data.success && data.data) {
        setProducts(Array.isArray(data.data) ? data.data.slice(0, 6) : []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-violet-50 to-purple-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
            The Future of{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Online Shopping
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Discover the latest tech products, curated collections, and a
            seamless shopping experience designed for modern customers.
          </p>

          {!currentUser ? (
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-semibold text-white hover:shadow-lg hover:scale-105 transition-all inline-block"
              >
                Start Shopping
              </Link>

              <Link
                href="/auth/login"
                className="rounded-lg border-2 border-violet-200 px-8 py-4 font-semibold text-slate-900 hover:bg-violet-50 hover:border-violet-300 transition-all inline-block"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="mt-10">
              {/* Empty state for logged in users - no button */}
            </div>
          )}
        </section>

        {/* Animated Banner Carousel Section */}
        <section className="relative w-full overflow-hidden py-24">
          <style>{`
            @keyframes bgShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            .banner-bg {
              background: linear-gradient(-45deg, #7c3aed, #9333ea, #06b6d4, #7c3aed);
              background-size: 400% 400%;
              animation: bgShift 15s ease infinite;
            }
            
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateX(30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes slideOut {
              from {
                opacity: 1;
                transform: translateX(0);
              }
              to {
                opacity: 0;
                transform: translateX(-30px);
              }
            }
            
            .carousel-slide {
              animation: slideIn 0.6s ease-out;
            }
            
            @keyframes glow {
              0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(99, 102, 241, 0.2); }
              50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(6, 182, 212, 0.4); }
            }
            
            @keyframes rotateBorder {
              0% { border-color: rgba(124, 58, 237, 0.5); }
              25% { border-color: rgba(147, 51, 234, 0.8); }
              50% { border-color: rgba(6, 182, 212, 0.8); }
              75% { border-color: rgba(124, 58, 237, 0.8); }
              100% { border-color: rgba(124, 58, 237, 0.5); }
            }
            
            .banner-card {
              animation: glow 3s ease-in-out infinite, rotateBorder 4s ease-in-out infinite;
            }
            
            .banner-icon {
              animation: bounce 2s ease-in-out infinite;
              display: inline-block;
            }
            
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            
            .banner-title {
              animation: titleGlow 2s ease-in-out infinite;
              text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
            }
            
            @keyframes titleGlow {
              0%, 100% { text-shadow: 0 0 10px rgba(6, 182, 212, 0.3), 0 0 20px rgba(139, 92, 246, 0.2); }
              50% { text-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(139, 92, 246, 0.4); }
            }
            
            .dot {
              transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .dot.active {
              background: linear-gradient(135deg, #06b6d4, #7c3aed);
              box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
              transform: scale(1.3);
            }
            
            .dot:not(.active) {
              background: rgba(255, 255, 255, 0.4);
            }
            
            .dot:hover:not(.active) {
              background: rgba(255, 255, 255, 0.6);
            }
            
            .carousel-btn {
              transition: all 0.3s ease;
              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(10px);
            }
            
            .carousel-btn:hover {
              background: rgba(255, 255, 255, 0.4);
              transform: scale(1.1);
            }
          `}</style>

          <div className="banner-bg relative w-full py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-16">
                Why Our Customers Love{" "}
                <span className="banner-title bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  T-Cart
                </span>
              </h2>

              {/* Carousel Container */}
              <div
                className="relative group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Main Slide */}
                <div className="relative rounded-3xl overflow-hidden">
                  <div className="carousel-slide">
                    <div className="banner-card w-full rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border-2 border-white/30 p-12 md:p-16">
                      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="banner-icon text-8xl md:text-9xl flex-shrink-0">
                          {bannerSlides[carouselIndex].icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            {bannerSlides[carouselIndex].title}
                          </h3>
                          <p className="text-white/90 text-base md:text-lg leading-relaxed">
                            {bannerSlides[carouselIndex].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Previous Button */}
                  <button
                    onClick={handlePrevSlide}
                    className="carousel-btn absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white border border-white/40 text-2xl z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ‹
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextSlide}
                    className="carousel-btn absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white border border-white/40 text-2xl z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ›
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center items-center gap-3 mt-8">
                  {bannerSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`dot h-3 w-3 rounded-full cursor-pointer ${
                        index === carouselIndex ? "active" : ""
                      }`}
                    />
                  ))}
                </div>

                {/* Auto-advance Indicator */}
                <div className="text-center mt-4 text-white/70 text-sm">
                  {isHovering ? "Paused" : `Next in 2s`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {currentUser && (
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-slate-900 mb-4">
                  Featured{" "}
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                    Products
                  </span>
                </h3>
                <p className="text-lg text-slate-600">
                  Check out our latest and most popular items
                </p>
              </div>

              {isLoadingProducts ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="group relative h-96 cursor-pointer"
                      onClick={() => router.push(`/products/${product.id}`)}
                      style={{
                        perspective: "1000px",
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <style>{`
                        @keyframes fadeInUp {
                          from {
                            opacity: 0;
                            transform: translateY(30px);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }
                        
                        .product-card-3d {
                          transition: transform 0.6s cubic-bezier(0.23, 1, 0.320, 1), 
                                      box-shadow 0.6s ease-out;
                          transform-style: preserve-3d;
                        }
                        
                        .product-card-3d:hover {
                          transform: rotateY(5deg) rotateX(-5deg) scale(1.05);
                          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);
                        }
                        
                        .product-image {
                          transition: transform 0.6s ease-out;
                        }
                        
                        .product-card-3d:hover .product-image {
                          transform: scale(1.1) translateZ(10px);
                        }
                        
                        .product-overlay {
                          transition: opacity 0.3s ease-out, backdrop-filter 0.3s ease-out;
                        }
                        
                        .product-card-3d:hover .product-overlay {
                          opacity: 1;
                          backdrop-filter: blur(4px);
                        }
                      `}</style>

                      <div className="product-card-3d relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-violet-200 shadow-lg">
                        {/* Image Container */}
                        <div className="relative h-2/3 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-image h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='%23999' text-anchor='middle' dy='.3em'%3E📦%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-4xl">
                              📦
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="product-overlay absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center">
                            <div className="text-center text-white">
                              <p className="text-sm font-semibold mb-2">
                                Click to view
                              </p>
                              <p className="text-xs opacity-90">details</p>
                            </div>
                          </div>
                        </div>

                        {/* Content Container */}
                        <div className="relative p-4 h-1/3 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                              {product.description?.slice(0, 50)}...
                            </p>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                              ${product.price.toFixed(2)}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                product.stock > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.stock > 0 ? "In Stock" : "Out"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-600">
                  No products available
                </div>
              )}

              <div className="mt-12 text-center">
                <button
                  onClick={() => router.push("/products")}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 font-semibold text-white hover:shadow-lg hover:scale-105 transition-all inline-block"
                >
                  View All Products →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="bg-gradient-to-r from-violet-50 to-purple-50 py-16 border-t border-violet-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Why Choose T-Cart?
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  desc: "Built with Next.js for incredible performance",
                },
                {
                  icon: "🔒",
                  title: "Secure",
                  desc: "Your data is protected with modern security",
                },
                {
                  icon: "🎯",
                  title: "User-Friendly",
                  desc: "Intuitive interface for seamless shopping",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl bg-white p-8 border border-violet-100 hover:shadow-xl hover:border-violet-300 hover:scale-105 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
