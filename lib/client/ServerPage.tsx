import { useLocation } from "preact-iso";
import { Children, cloneElement, type PropsWithChildren, useEffect, useState } from "preact/compat";

export function ServerPage(props: PropsWithChildren<{ loader_path: string }>) {
  const [data_props, setDataProps] = useState<Record<string, any>>({});

  const location = useLocation();

  useEffect(() => {
    // @ts-expect-error
    if (location.wasPush === false) return;

    (async () => {
      const res = await fetch(props.loader_path, {
        method: "POST",
      });
      const server_props = await res.json();
      setDataProps(server_props);
    })();
  }, [props.loader_path, location]);

  const child = Children.toArray(props.children)[0];

  if (!child) return null;

  const childWithProps = cloneElement(child, data_props);

  return childWithProps;
}
