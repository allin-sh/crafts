import { useEffect, useRef } from 'react';

export const useMouseTracking = (onMouseMove?: (event: MouseEvent) => void) => {
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const onMouseMoveRef = useRef(onMouseMove);

  useEffect(() => {
    onMouseMoveRef.current = onMouseMove;
  }, [onMouseMove]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      onMouseMoveRef.current?.(event);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePositionRef;
};
