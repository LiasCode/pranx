import { useSignal } from "@preact/signals";

export function SignalsTest() {
  const count = useSignal(1);

  return (
    <>
      <h2>Signals</h2>
      <button
        onClick={() => {
          count.value = count.value + 1;
          console.log(count.value);
        }}
      >
        Preact signals must works {"->"} {count.value}
      </button>
    </>
  );
}
