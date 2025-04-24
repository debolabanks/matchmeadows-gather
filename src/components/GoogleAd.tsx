
import { useEffect, useRef } from "react";

interface GoogleAdProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const GoogleAd = ({ 
  slot, 
  format = "auto", 
  responsive = true, 
  style,
  className
}: GoogleAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only proceed if we're in production mode or have AdSense enabled
    if (import.meta.env.PROD || import.meta.env.VITE_ADSENSE_ENABLED === "true") {
      try {
        if (adRef.current && adRef.current.innerHTML === '') {
          // Add the ad after component mounts
          const adScript = document.createElement('ins');
          adScript.className = 'adsbygoogle';
          adScript.style.display = 'block';
          adScript.dataset.adClient = import.meta.env.VITE_ADSENSE_CLIENT || "ca-pub-xxxxxxxxxxxxxxxx"; // Replace with your AdSense publisher ID
          adScript.dataset.adSlot = slot;
          
          if (responsive) {
            adScript.dataset.adFormat = format;
            adScript.dataset.fullWidthResponsive = "true";
          }
          
          adRef.current.appendChild(adScript);
          
          // Execute ad code
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('Error loading Google AdSense:', error);
      }
    }
    
    return () => {
      // Clean up on unmount
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [slot, format, responsive]);

  return <div ref={adRef} className={className} style={style} />;
};

export default GoogleAd;
