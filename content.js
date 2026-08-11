//@ts-check

/** @param {Node} node */
const getText = (node) => {
  if (node instanceof HTMLImageElement) {
    return node.getAttribute('shared-tooltip-text') || node.alt || undefined;
  } else if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || undefined;
  } else {
    return undefined;
  }
}

/** @param {ClipboardEvent} event */
const handler = (event) => {
  const data = event.clipboardData?.getData('text/html');
  if (!data) return;

  const root = document.createElement('parent');
  root.innerHTML = data;
  if (!root.querySelector('.yt-formatted-string')) return;

  event.preventDefault();
  event.stopPropagation();

  const walker = document.createTreeWalker(
    root, 
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );

  for (let cur = walker.nextNode(); cur; cur = walker.nextNode()) {
    const text = getText(cur);
    if (text) {
      document.execCommand('insertText', false, text.replaceAll(/[\r\n]+/g, ' '));
    }
  }
}

const check = () => {
  const input = document.querySelector('div#input[contenteditable],div#contenteditable-root[contenteditable]');
  if (input instanceof HTMLElement) {
    input.removeEventListener('paste', handler, { capture: true });
    input.addEventListener('paste', handler, { capture: true });
  }
}

new MutationObserver(check).observe(document, { childList: true, subtree: true });
check();
