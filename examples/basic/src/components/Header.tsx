export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md py-4 px-6">
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Pranx Basic</h1>
      <nav>
        <ul className="flex gap-6">
          <li>
            <a
              href="/"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/products"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Products
            </a>
          </li>
          <li>
            <a
              href="/products/2"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Products 2
            </a>
          </li>
          <li>
            <a
              href="/not-found"
              className="text-white hover:text-indigo-200 transition-colors font-medium"
            >
              Not Found
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
