import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>();

  useEffect(() => {
    if (typeof window != 'undefined') {
      setIsMobile(window?.innerWidth < breakpoint);

      const handleResize = () => {
        setIsMobile(window?.innerWidth < breakpoint);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup listener on unmount
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
