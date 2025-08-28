import { Link } from "pranx/client";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md py-4 px-6">
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Pranx Basic</h1>
      <nav>
        <ul className="flex gap-6">
          <li>
            <Link
              to="/"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/products/2"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Products 2
            </Link>
          </li>

          <li>
            <Link
              to="/products/3/agustin"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Product/:id/:name
            </Link>
          </li>

          <li>
            <Link
              to="/not-found"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Not Found
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
