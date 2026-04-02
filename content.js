//@ts-check

/** @param {HTMLElement} input */
const register = (input) => {
  console.log('Registering paste event listener for input:', input);
  input.addEventListener('paste', (event) => {
    const data = event.clipboardData?.getData('text/html');
    const content = data?.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/)?.[1];
    // const emojis = window?.ytInitialData?.continuationContents?.liveChatContinuation?.emojis;
    // console.debug('Pasted content:', content);
    // console.debug('Available emojis:', emojis);
    // if (!content || !emojis) return;
    if (!content) return;

    event.preventDefault();
    event.stopPropagation();

    const div = document.createElement('div');
    div.innerHTML = content;
    console.debug('Parsed content:', div);
    for (const ch of div.childNodes) {
      console.debug('Processing child node:', ch);
      if (ch instanceof HTMLImageElement) {
        // const emoji = emojis.find(e => e.emojiId === ch.dataset.emojiId);
        // const text = emoji?.shortcuts?.[0] || ch.alt || '';
        const text = `:${ch.alt}:` || '';
        document.execCommand('insertHTML', false, text);
      } else {
        document.execCommand('insertHTML', false, ch.textContent || '');
      }
    }
  }, { capture: true });
}

const check = () => {
  const input = document.querySelector('div#input[contenteditable]');
  if (input instanceof HTMLElement) {
    register(input);
    return true;
  }
  return false;
}

check() || new MutationObserver((_, observer) => {
  if (check()) observer.disconnect();
}).observe(document, { childList: true, subtree: true });

console.log('YTLive Paste Fixer loaded');
