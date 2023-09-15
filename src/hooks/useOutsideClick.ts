import { useEffect, useRef, MutableRefObject } from 'react';

export function useOutsideClick(
  handler: () => void,
  listenCapturing: boolean = true
): MutableRefObject<undefined | any> {
  const ref = useRef<any>();

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    };

    document.addEventListener('click', handleClick, listenCapturing);
    return () =>
      document.removeEventListener('click', handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
