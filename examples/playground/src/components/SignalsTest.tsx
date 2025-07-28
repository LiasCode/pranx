import { useSignal } from "@preact/signals";
import { Button } from "./ui/button";

export function SignalsTest() {
  const count = useSignal(1);

  return (
    <>
      <h2>Signals</h2>
      <Button
        onClick={() => {
          count.value = count.value + 1;
          console.log(count.value);
        }}
      >
        Preact signals must works {"->"} {count.value}
      </Button>
    </>
  );
}
