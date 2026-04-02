export {}; // ← これを入れてファイルをモジュール扱いにする

declare global {
  interface Window {
    ytInitialData?: {
      continuationContents?: {
        liveChatContinuation?: {
          emojis?: {
            emojiId: string;
            shortcuts: string[];
          }[];
        };
      };
    };
  }
}
