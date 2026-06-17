import { ImgHTMLAttributes, useEffect, useState } from 'react';
import { resolveBrowserImageUrl } from '../../lib/browserImageStore';

export const useResolvedImageUrl = (src?: string | null) => {
  const [resolvedSrc, setResolvedSrc] = useState(src || '');

  useEffect(() => {
    let isMounted = true;
    let objectUrl = '';

    resolveBrowserImageUrl(src)
      .then((nextSrc) => {
        if (!isMounted) return;
        objectUrl = nextSrc.startsWith('blob:') ? nextSrc : '';
        setResolvedSrc(nextSrc);
      })
      .catch(() => {
        if (isMounted) setResolvedSrc('');
      });

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return resolvedSrc;
};

interface StoredImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

const StoredImage = ({ src, alt, ...props }: StoredImageProps) => {
  const resolvedSrc = useResolvedImageUrl(src);
  if (!resolvedSrc) return null;
  return <img src={resolvedSrc} alt={alt || ''} {...props} />;
};

export default StoredImage;

