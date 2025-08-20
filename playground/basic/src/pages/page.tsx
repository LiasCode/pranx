export default function HomePage() {
  return <div>Home Page</div>;
}

export const getStaticProps = () => {
  return {
    title: "hola",
  };
};
