import Docs from "./docs.md";

export function MdTest() {
  return (
    <>
      <h2>Markdown supported</h2>
      <h3>The next content should be a markdown rendered as html correctly</h3>
      <Docs />
    </>
  );
}
