import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { fromEvent } from 'rxjs';
import Victor from 'victor';
import { showEmoji } from './CursorEmoji';
import './pie_menu.css';
import { useMouseTracking } from './useMouseTracking';

const getCenter = (element: HTMLElement) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};

type PieMenuProps = {
  onSelect: (item: PieMenuItem) => void;
};

export type PieMenuItem = {
  label: string;
  icon: string;
  flex: Pick<CSSProperties, 'alignItems' | 'justifyContent'>;
};

const MENU_ITEMS = [
  {
    label: 'wow',
    icon: '😱',
    flex: {
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
  },
  {
    label: 'good',
    icon: '👍',

    flex: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  },
  {
    label: 'piero',
    icon: '🤡',
    flex: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  },
  {
    label: 'bad',
    icon: '👎',
    flex: {
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  },
] satisfies PieMenuItem[];

const SLOT_COUNT = 4;

const getActiveSlotIdx = (angle: number): number => {
  const normalizedAngle = normalizeAngle(angle);
  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    return 0;
  }

  if (normalizedAngle >= 45 && normalizedAngle < 135) {
    return 1;
  }

  if (normalizedAngle >= 135 && normalizedAngle < 225) {
    return 2;
  }

  return 3;
};

const normalizeAngle = (angle: number): number => {
  return (angle + 360) % 360;
};

const makeSmileCursor = () => {
  document.body.style.cursor = 'url(/svg/mood-smile.svg) 8 8, auto';
};

const resetCursor = () => {
  document.body.style.removeProperty('cursor');
};

const FONT_SIZE = 36;
const PIE_MENU_WIDTH = 250;
const CORE_WIDTH = 75;

export const PieMenu = ({ onSelect }: PieMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);
  const activeSlotIdxRef = useRef(0);
  const [show, setShow] = useState(false);
  const mousePositionRef = useMouseTracking();

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || !show) return;

    const center = getCenter(containerRef.current);
    const setWrapperAngle = gsap.quickSetter(containerRef.current, '--a', 'deg');
    const onMouseMove = (event: MouseEvent) => {
      if ((event.target as HTMLElement).classList.contains('core')) {
        setActiveSlotIdx(-1);
        activeSlotIdxRef.current = -1;
        return;
      }

      const { clientX, clientY } = event;
      const vec = new Victor(clientX - center.x, center.y - clientY);

      const angle = vec.verticalAngleDeg();
      setWrapperAngle(angle);

      const activeSlotIdx = getActiveSlotIdx(angle);

      setActiveSlotIdx(activeSlotIdx);
      activeSlotIdxRef.current = activeSlotIdx;
    };

    const subscription = fromEvent(window, 'mousemove').subscribe(e => onMouseMove(e as MouseEvent));

    return () => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    };
  }, [show]);

  useHotkeys(
    't',
    e => {
      // 키보드 누르는동안 show 상태를 유지하기 위해 조건 추가
      if (!show) {
        makeSmileCursor();
        document.body.style.setProperty('--pie-menu-x', `${mousePositionRef.current.x}px`);
        document.body.style.setProperty('--pie-menu-y', `${mousePositionRef.current.y}px`);
        setShow(true);
      }
    },
    {
      keydown: true,
      keyup: false,
    },
    [show],
  );

  useHotkeys(
    't',
    () => {
      setShow(false);
      document.body.style.removeProperty('--pie-menu-x');
      document.body.style.removeProperty('--pie-menu-y');
      resetCursor();
      if (activeSlotIdxRef.current === -1) {
        return;
      }
      const item = MENU_ITEMS[activeSlotIdxRef.current];
      if (!item) return;

      onSelect(item);
      showEmoji(item.icon, {
        duration: 2000,
        label: item.label,
      });

      setActiveSlotIdx(-1);
      activeSlotIdxRef.current = -1;
    },
    {
      keydown: false,
      keyup: true,
    },
    [show, onSelect],
  );

  useGSAP(
    () => {
      if (!show) return;
      const tl = gsap.timeline({
        onComplete: () => console.log('모든 애니메이션 완료'),
      });

      gsap.set('.mantle', {
        rotate: '-1deg',
      });

      tl.fromTo(
        '.mantle',
        {
          '--mask-size': `${(CORE_WIDTH / PIE_MENU_WIDTH) * 100 + 7}%`,
        },
        {
          '--mask-size': `${(CORE_WIDTH / PIE_MENU_WIDTH) * 100 - 3}%`,
          duration: 0.2,
        },
        '<',
      )
        .fromTo(
          '.menu_item',
          {
            rotate: index => {
              return `${45 + index * 90 + 5}deg`;
            },
            opacity: 0,
            filter: 'blur(10px)',
          },
          {
            rotate: index => {
              return `${45 + index * 90}deg`;
            },
            opacity: 1,
            stagger: 0.05,
            filter: 'blur(0px)',
            duration: 0.15,
            ease: 'power1.inOut',
          },
          '<',
        )
        .to(
          '.mantle',
          {
            rotate: '0deg',
            duration: 0.05,
            ease: 'power1.inOut',
            '--mask-size': `${(CORE_WIDTH / PIE_MENU_WIDTH) * 100}%`,
          },
          '>',
        )
        .to(
          '.core',
          {
            boxShadow: '0 0 10px 0px rgba(0, 0, 0, 0.15)',
            duration: 0.0001,
          },
          '<',
        );
    },
    {
      dependencies: [show],
      scope: containerRef,
    },
  );

  return (
    <>
      {show && (
        <div
          style={
            {
              '--slot-count': SLOT_COUNT,
            } as CSSProperties
          }
          className={'pie_menu_wrapper'}
          ref={containerRef}
        >
          <motion.div
            className='mantle'
            style={
              {
                '--mask-size': `${(CORE_WIDTH / PIE_MENU_WIDTH) * 100}%`,
                maskImage:
                  'radial-gradient(circle closest-side, transparent 0%, transparent var(--mask-size), black var(--mask-size), black 100%)',
              } as CSSProperties
            }
          >
            {MENU_ITEMS.map((item, idx) => (
              <motion.li
                data-active={activeSlotIdx === idx}
                className='menu_item'
                key={item.label}
                style={
                  {
                    '--rotate': 45 + idx * 90,
                    width: `${PIE_MENU_WIDTH}px`,
                    height: `${PIE_MENU_WIDTH}px`,
                    rotate: 'calc(var(--rotate) * 1deg)',
                  } as CSSProperties
                }
              >
                <motion.span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '12px',
                    rotate: 'calc((var(--rotate) * 1deg) * -1)',
                    display: 'flex',
                    alignItems: item.flex.alignItems,
                    justifyContent: item.flex.justifyContent,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    fontSize: `${FONT_SIZE}px`,
                    opacity: 0.5,
                  }}
                >
                  {item.icon}
                </motion.span>
              </motion.li>
            ))}
          </motion.div>
          <motion.div
            className='core'
            style={{
              width: `${CORE_WIDTH}px`,
              height: `${CORE_WIDTH}px`,
            }}
            initial={{ scale: 1.05, origin: 'center' }}
            animate={{ scale: 1, origin: 'center' }}
            transition={{ type: 'spring', duration: 0.4 }}
          />
        </div>
      )}
    </>
  );
};
