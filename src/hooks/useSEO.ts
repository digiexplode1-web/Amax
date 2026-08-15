import { useEffect } from 'react';

export const useSEO = (title: string, description?: string) => {
  useEffect(() => {
    // Update Title
    const defaultTitle = 'Amax Crafts | Custom CNC Laser Cutting Jalis & Room Dividers';
    document.title = title ? `${title} | Amax Crafts` : defaultTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    const defaultDesc = 'Premium custom CNC laser cutting jalis, decorative room dividers, steel gate designs, and wedding accessories.';
    metaDescription.setAttribute('content', description || defaultDesc);
  }, [title, description]);
};
