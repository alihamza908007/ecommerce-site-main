import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold text-slate-900">About T-Cart</h3>
            <p className="mt-2 text-sm text-slate-600">
              A modern e-commerce platform built with Next.js and Prisma for
              seamless shopping experiences.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Quick Links</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>
                <Link
                  href="/products"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Contact</h3>
            <p className="mt-2 text-sm text-slate-600">support@t-cart.com</p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-600">
            © {new Date().getFullYear()} T-Cart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
