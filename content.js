//@ts-check

/** @param {HTMLImageElement} img */
const getText = (img) => {
  const { alt, dataset: { emojiId } } = img;
  // Not youtube emoji, just return alt text
  if (!emojiId) return alt || '';
  // For youtube official emoji, return :alt:
  if (emojiId.startsWith('UCkszU2WH9gy1mb0dV-11UJg/')) return `:${alt}:`;
  // For custom emoji, return :_alt:
  return `:_${alt}:`;
}

/** @param {ClipboardEvent} event */
const halder = (event) => {
  const data = event.clipboardData?.getData('text/html');
  const content = data?.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/)?.[1];
  if (!content) return;

  event.preventDefault();
  event.stopPropagation();

  const div = document.createElement('div');
  div.innerHTML = content;
  for (const ch of div.childNodes) {
    if (ch instanceof HTMLImageElement) {
      document.execCommand('insertHTML', false, getText(ch));
    } else {
      document.execCommand('insertHTML', false, ch.textContent || '');
    }
  }
}

const check = () => {
  const input = document.querySelector('div#input[contenteditable],div#contenteditable-root[contenteditable]');
  if (input instanceof HTMLElement) {
    input.removeEventListener('paste', halder, { capture: true });
    input.addEventListener('paste', halder, { capture: true });
  }
}

new MutationObserver(check).observe(document, { childList: true, subtree: true });
check()
