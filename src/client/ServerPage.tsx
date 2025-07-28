import { type LocationHook, useLocation } from "preact-iso";
import {
  Children,
  cloneElement,
  type PropsWithChildren,
  useLayoutEffect,
  useState,
} from "preact/compat";

export function ServerPage(props: PropsWithChildren) {
  const loader_path = window.location.pathname;
  const [data_props, setDataProps] = useState<Record<string, any>>({});

  const location = useLocation() as LocationHook & { wasPush: boolean };

  useLayoutEffect(() => {
    if (location.wasPush === false) return;

    (async () => {
      const res = await fetch(loader_path, {
        method: "POST",
      });
      const server_props = await res.json();
      setDataProps(server_props);
    })();
  }, [loader_path, location]);

  const child = Children.toArray(props.children)[0];

  if (!child) return null;

  const childWithProps = cloneElement(child, data_props);

  return childWithProps;
}
