const loadedCSS = new Set<string>();

// Have to call this once on startup to collect already-loaded stylesheets.
export function collectCurrentStylesheets() {
  const links = document.head.querySelectorAll('link[rel="stylesheet"]');
  for (const link of links) {
    if (link instanceof HTMLLinkElement && link.href) {
      loadedCSS.add(link.href);
    }
  }
}

// Reconciles the current <head> with the new head HTML, preserving already loaded styles and avoiding redundant downloads.
export function updateHead(newHeadHTML: string) {
  const temp = document.createElement("head");
  temp.innerHTML = newHeadHTML;

  const newNodes = Array.from(temp.children);
  const currentNodes = Array.from(document.head.children);

  // Add new nodes that aren't already in the head
  for (const node of newNodes) {
    // Skip if it's a stylesheet and already loaded
    if (node.tagName === "LINK" && (node as HTMLLinkElement).rel === "stylesheet") {
      const href = (node as HTMLLinkElement).href;
      if (loadedCSS.has(href)) continue;
      loadedCSS.add(href);
      document.head.appendChild(node.cloneNode(true));
      return;
    }

    // Avoid duplication
    const exists = currentNodes.some((existing) => existing.outerHTML === node.outerHTML);
    if (!exists) {
      document.head.appendChild(node.cloneNode(true));
    }
  }

  // Remove old nodes that aren't in the new head (except script and stylesheets)
  for (const node of currentNodes) {
    const isInNew = newNodes.some((newNode) => newNode.outerHTML === node.outerHTML);

    const isProtected =
      node.tagName === "SCRIPT" ||
      (node.tagName === "LINK" && (node as HTMLLinkElement).rel === "stylesheet");

    if (!isInNew && !isProtected) {
      document.head.removeChild(node);
    }
  }
}

export const active_css = () => {
  const currentPath = window.location.pathname;

  const links = document.head.querySelectorAll('link[rel="stylesheet"]');

  for (const link of links) {
    if (!(link instanceof HTMLLinkElement)) continue;

    const linkUrl = new URL(link.href);
    let hrefWithOutFileName = linkUrl.pathname;
    const hrefSplitted = hrefWithOutFileName.split("/");
    hrefSplitted.pop();
    hrefWithOutFileName = hrefSplitted.join("/");

    if (currentPath === hrefWithOutFileName) {
      link.disabled = false;
    } else {
      link.disabled = true;
    }
  }
};
