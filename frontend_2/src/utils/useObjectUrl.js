import { useEffect, useState } from 'react';

// Preview URL for a local File. Unlike a base64 data URL it doesn't load the
// whole file into memory, and it is revoked when the file changes.
export const useObjectUrl = (file) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
};
