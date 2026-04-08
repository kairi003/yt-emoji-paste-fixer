//@ts-check

/** @param {HTMLImageElement} img */
const getImgText = (img) => {
  const { alt, dataset: { emojiId } } = img;
  // Not youtube emoji, just return alt text
  if (!emojiId) return alt || '';
  // For youtube official emoji, return :alt:
  if (emojiId.startsWith('UCkszU2WH9gy1mb0dV-11UJg/')) return `:${alt}:`;
  // For custom emoji, return :_alt:
  return `:_${alt}:`;
}

/** @param {ClipboardEvent} event */
const handler = (event) => {
  const data = event.clipboardData?.getData('text/html');
  if (!data) return;

  const div = document.createElement('div');
  div.innerHTML = data.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/)?.[1] ?? data;
  if (!div.querySelector('.yt-formatted-string')) return;

  event.preventDefault();
  event.stopPropagation();

  for (const ch of div.childNodes) {
    if (/#comment|meta/.test(ch.nodeName.toLowerCase())) continue;
    if (ch instanceof HTMLImageElement) {
      document.execCommand('insertHTML', false, getImgText(ch));
    } else {
      document.execCommand('insertHTML', false, ch.textContent || '');
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
