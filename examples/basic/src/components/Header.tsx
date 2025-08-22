export function Header() {
  return (
    <header>
      <h1>Pranx Basic</h1>
      <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </ul>
    </header>
  );
}
