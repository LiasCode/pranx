export function Header() {
  return (
    <header class="w-full flex flex-row gap-3 border rounded-md p-2 border-blue-400">
      <ul class="flex flex-row gap-3 items-center justify-center w-full">
        <li class="hover:text-blue-400">
          <a href="/">Home</a>
        </li>
        <li class="hover:text-blue-400">
          <a href="/server">Server</a>
        </li>
      </ul>
    </header>
  );
}
