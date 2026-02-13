import { useState } from 'react';

type CopyFn = (text: string) => Promise<boolean>;

export default function useCopyToClipboard(): [string | null, CopyFn] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedText(null);
      }, 2000);

      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}
