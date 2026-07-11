'use client';

import { useState, useEffect } from 'react';

export function useObjectUrl(file: File | null): string | null {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setObjectUrl(null);
      };
    }
  }, [file]);

  return objectUrl;
}
