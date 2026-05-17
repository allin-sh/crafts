import { atom, getDefaultStore, useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { type CSSProperties, useRef } from 'react';
import './cursor_emoji.css';
import { Portal } from './Portal';
import { useMouseTracking } from './useMouseTracking';

const ANCHOR_SIZE = 16;

type Emoji = {
  id: string;
  emoji: string;
  timeoutId: ReturnType<typeof setTimeout>;
  label?: string;
};

const emojis$ = atom<Emoji[]>([]);

type PopEmojiOption = {
  /**
   * @default 3000ms;
   */
  duration?: number;
  label?: string;
};

export const showEmoji = (emoji: string, option?: PopEmojiOption) => {
  const store = getDefaultStore();
  const disapperTime = option?.duration ?? 3000;
  const id = `${Date.now()}`;

  const emojis = store.get(emojis$);
  for (const e of emojis) {
    clearTimeout(e.timeoutId);
  }

  const newTimeoutId = setTimeout(() => {
    store.set(
      emojis$,
      store.get(emojis$).filter(e => e.timeoutId !== newTimeoutId),
    );
  }, disapperTime);

  store.set(emojis$, [{ id, emoji, timeoutId: newTimeoutId, label: option?.label }]);
};

export const Emoji = () => {
  const emojis = useAtomValue(emojis$);
  const mousePositionRef = useMouseTracking();

  return (
    <>
      <AnimatePresence>
        {emojis.map(item => {
          return (
            <CursorEmoji
              initialPosition={mousePositionRef.current}
              key={item.id}
              emoji={item.emoji}
              label={item.label}
            />
          );
        })}
      </AnimatePresence>
    </>
  );
};

type CursorEmojiProps = {
  emoji: string;
  initialPosition: {
    x: number;
    y: number;
  };
  label?: string;
};

export const CursorEmoji = ({ emoji, label, initialPosition }: CursorEmojiProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useMouseTracking(event => {
    const { clientX, clientY } = event;
    const centerX = clientX - ANCHOR_SIZE / 2;
    const centerY = clientY - ANCHOR_SIZE / 2;

    ref.current?.style.setProperty('--top', `${centerY}px`);
    ref.current?.style.setProperty('--left', `${centerX}px`);
  });

  return (
    <Portal>
      <div
        ref={ref}
        style={
          {
            '--top': `${initialPosition.y}px`,
            '--left': `${initialPosition.x}px`,
            width: `${ANCHOR_SIZE}px`,
            height: `${ANCHOR_SIZE}px`,
            top: 'var(--top)',
            left: 'var(--left)',
          } as CSSProperties
        }
        className='anchor absolute inset-0 select-none pointer-events-none will-change-transform'
      ></div>
      <motion.div
        aria-label={label ?? 'emoji'}
        initial={{
          opacity: 0,
          scale: 0.85,
          filter: 'blur(4px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            type: 'spring',
            stiffness: 700,
            damping: 30,
            mass: 1,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          filter: 'blur(10px)',
          transition: {
            type: 'spring',
            stiffness: 700,
            damping: 30,
            mass: 1,
          },
        }}
        style={{
          fontSize: '48px',
          width: 'fit-content',
          padding: '12px',
          borderRadius: '12px',
          backgroundColor: '#fff',
        }}
        className='emoji_container'
      >
        <span>{emoji}</span>
      </motion.div>
    </Portal>
  );
};
