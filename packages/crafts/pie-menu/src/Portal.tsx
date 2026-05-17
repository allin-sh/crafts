import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  /**
   * 포탈을 연결할 부모의 element 입니다.
   */
  parent?: HTMLElement;
  children: ReactNode;
  scrollLockTargetElement?: HTMLElement;
}

export const Portal = ({ children, parent, scrollLockTargetElement }: PortalProps) => {
  const portalDOMRef = useRef<HTMLElement | null>(null);
  const [isPortalMounted, setIsPortalMounted] = useState(false);
  const id = useId();
  useEffect(() => {
    if (parent) {
      portalDOMRef.current = parent;
      setIsPortalMounted(true);
      return;
    }

    const containerId = `portal_container_${id}`;
    const container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    portalDOMRef.current = container;
    setIsPortalMounted(true);

    if (scrollLockTargetElement) {
      scrollLockTargetElement.style.overflow = 'hidden';
    }

    return () => {
      if (!portalDOMRef.current) return;

      const mountedElement = portalDOMRef.current;
      if (!mountedElement.parentElement) throw new Error('포탈 element 의 부모를 찾을 수 없습니다!');

      portalDOMRef.current = null;
      mountedElement.remove();

      if (scrollLockTargetElement) {
        scrollLockTargetElement.style.overflow = '';
      }

      setIsPortalMounted(false);
    };
  }, [parent, scrollLockTargetElement, id]);

  if (!isPortalMounted) return null;
  if (!portalDOMRef.current) return null;

  // 포탈 생성
  return createPortal(children, portalDOMRef.current);
};
