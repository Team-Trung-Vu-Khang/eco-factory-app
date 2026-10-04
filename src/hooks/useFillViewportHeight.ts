import { useLayoutEffect, useState } from "react";

/**
 * Height from the element's top edge to the bottom of the screen (as a CSS value),
 * so a page background reaches the screen bottom without forcing extra scroll.
 * Returns a callback ref, so it also works for elements mounted later.
 */
export function useFillViewportHeight<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [top, setTop] = useState<number>();

  useLayoutEffect(() => {
    if (!node) return;
    const measure = () =>
      setTop(node.getBoundingClientRect().top + window.scrollY);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [node]);

  const height = top === undefined ? undefined : `calc(100dvh - ${top}px)`;
  return [setNode, height] as const;
}
