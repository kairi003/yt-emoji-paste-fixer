//@ts-check

/** @param {Node} node */
const getText = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || undefined;
  }

  if (node instanceof HTMLImageElement) {
    const { alt, dataset: { emojiId } } = node;
    const sharedTooltipText = node.getAttribute('shared-tooltip-text');
    // return shared-tooltip-text if available
    if (sharedTooltipText) return sharedTooltipText;
    // no alt text, return undefined
    if (!alt) return undefined;
    // no emojiId, return alt text
    if (!emojiId) return alt;
    // return :{alt}: for official emojis, otherwise return :_{alt}: for custom emojis
    return emojiId.startsWith('UCkszU2WH9gy1mb0dV-11UJg/') ? `:${alt}:` : `:_${alt}:`;
  }

  return undefined;
}

/** @param {ClipboardEvent} event */
const handler = (event) => {
  const data = event.clipboardData?.getData('text/html');
  if (!data) return;

  const root = document.createElement('parent');
  root.innerHTML = data.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/)?.[1] ?? data;
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
