export function Meta(props: { meta: string }) {
  document.head.innerHTML = props.meta;

  return <></>;
}
