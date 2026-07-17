import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP quickSetter for better performance
    const setX = gsap.quickSetter(cursor, 'x', 'px');
    const setY = gsap.quickSetter(cursor, 'y', 'px');

    const onMouseMove = (e: MouseEvent) => {
      // Center the cursor
      setX(e.clientX - 32); // 24 is half of 48px
      setY(e.clientY - 32);
    };

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we are hovering over a button or link
      if (target.closest('button, a, [role="button"]')) {
        gsap.to(cursor, { scale: 64 / 28, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"]')) {
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseEnter);
    document.addEventListener('mouseout', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseEnter);
      document.removeEventListener('mouseout', onMouseLeave);
    };
  }, []);

  // Use a class to hide the default cursor on body if desired, but here we just overlay
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-12 h-12 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ transform: 'translate(-100px, -100px)' }} // Start offscreen
    />
  );
}
