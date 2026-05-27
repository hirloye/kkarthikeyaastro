"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Setup intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('animate-on-scroll-hidden');
          entry.target.classList.add('animate-on-scroll-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15 // wait until 15% of the element is visible
    });

    // Small delay to let Next.js render the DOM first
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll(`
        main h1, main h2, main h3, main h4, main h5, main h6,
        main p, main li, main span.text-slate-500, main label,
        main img, main svg, main article,
        main div[class*="rounded-"], main div[class*="bg-slate-"]
      `);
      
      elements.forEach(el => {
        // Only observe elements that haven't been animated yet
        if (!el.classList.contains('animate-on-scroll-visible')) {
          el.classList.add('animate-on-scroll-hidden');
          observer.observe(el);
        }
      });
    }, 150);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
