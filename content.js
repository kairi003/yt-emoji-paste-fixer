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

/** @param {string} data */
const parseYTComment = (data) => {
  try {
    const dom = new DOMParser().parseFromString(data, 'text/html');
    const result = [];
    for (const ch of dom.body.childNodes) {
      if (/#comment|META/.test(ch.nodeName)) continue;
      if (ch instanceof HTMLImageElement && ch.classList.contains('yt-formatted-string')) {
        result.push(getText(ch))
        continue;
      }
      if (ch instanceof HTMLSpanElement) {
        result.push(ch.textContent)
        continue;
      }
      // Not supported node, just return null to prevent pasting 
      return null;
    }
    return result;
  } catch {
    // If any error occurs, just return null to prevent pasting
    return null;
  }
}

/** @param {ClipboardEvent} event */
const handler = (event) => {
  const data = event.clipboardData?.getData('text/html');
  if (!data) return;
  const commentData = parseYTComment(data);
  if (!commentData || commentData.length === 0) return;

  event.preventDefault();
  event.stopPropagation();

  for (const text of commentData) {
    document.execCommand('insertHTML', false, text);
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
check()
