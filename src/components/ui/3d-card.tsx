'use client';

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  ElementType,
  ComponentPropsWithoutRef,
} from 'react';
import './3d-card.css';

interface MouseEnterContextValue {
  isMouseEntered: boolean;
  setIsMouseEntered: React.Dispatch<React.SetStateAction<boolean>>;
}

const MouseEnterContext = createContext<MouseEnterContextValue>({
  isMouseEntered: false,
  setIsMouseEntered: () => {},
});

export function useMouseEnter() {
  return useContext(MouseEnterContext);
}

export interface CardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Maximum rotation angle in degrees (default: 4.5°, recommended range 3°–6°) */
  maxTilt?: number;
  /** Upward elevation lift in pixels on hover (default: 5px, recommended range 3–8px) */
  lift?: number;
  /** Perspective depth in pixels (default: 1000px) */
  perspective?: number;
  /** Optional accent glow color (e.g. #EF4444 or rgba(239, 68, 68, 0.35)) */
  glowColor?: string;
  /** Explicitly disable 3D tilt */
  disabled?: boolean;
}

export function CardContainer({
  children,
  className = '',
  containerClassName = '',
  maxTilt = 4.5,
  lift = 5,
  perspective = 1000,
  glowColor,
  disabled = false,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...rest
}: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const rafId = useRef<number | null>(null);

  const handlePointerEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (typeof window !== 'undefined') {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouch = window.matchMedia('(hover: none)').matches;
        if (isReduced || isTouch) return;
      }
      setIsMouseEntered(true);
      setIsHovering(true);
      if (onMouseEnter) onMouseEnter(e);
    },
    [disabled, onMouseEnter]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !containerRef.current) return;
      if (typeof window !== 'undefined') {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouch = window.matchMedia('(hover: none)').matches;
        if (isReduced || isTouch) return;
      }

      if (onMouseMove) onMouseMove(e);

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Normalized relative coordinates from center (-1 to 1)
        const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // Clamped tilt angles (inverted Y for natural tilt towards cursor)
        const rotX = Math.max(-maxTilt, Math.min(maxTilt, -relY * maxTilt));
        const rotY = Math.max(-maxTilt, Math.min(maxTilt, relX * maxTilt));

        // Optional dynamic accent shadow offset
        let shadowStyle = '';
        if (glowColor) {
          const shadowX = -rotY * 2;
          const shadowY = rotX * 2 + 12;
          shadowStyle = `${shadowX}px ${shadowY}px 32px ${glowColor}, 0 20px 40px rgba(0,0,0,0.6)`;
        }

        const bodyEl = containerRef.current.querySelector(
          '.hwi-3d-card-body'
        ) as HTMLElement | null;

        if (bodyEl) {
          bodyEl.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-${lift}px)`;
          if (shadowStyle) {
            bodyEl.style.boxShadow = shadowStyle;
          }
        }
      });
    },
    [disabled, maxTilt, lift, glowColor, onMouseMove]
  );

  const handlePointerLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      setIsMouseEntered(false);
      setIsHovering(false);

      if (containerRef.current) {
        const bodyEl = containerRef.current.querySelector(
          '.hwi-3d-card-body'
        ) as HTMLElement | null;
        if (bodyEl) {
          bodyEl.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0px)`;
          bodyEl.style.boxShadow = '';
        }
      }

      if (onMouseLeave) onMouseLeave(e);
    },
    [disabled, onMouseLeave]
  );

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <MouseEnterContext.Provider value={{ isMouseEntered, setIsMouseEntered }}>
      <div
        ref={containerRef}
        className={`hwi-3d-card-container ${containerClassName}`}
        style={{
          perspective: `${perspective}px`,
          ...style,
        }}
        onMouseEnter={handlePointerEnter}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        {...rest}
      >
        {children}
      </div>
    </MouseEnterContext.Provider>
  );
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardBody({
  children,
  className = '',
  style,
  ...rest
}: CardBodyProps) {
  const { isMouseEntered } = useMouseEnter();

  return (
    <div
      className={`hwi-3d-card-body ${isMouseEntered ? 'is-hovering' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

type CardItemProps<T extends ElementType = 'div'> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  style?: React.CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>;

export function CardItem<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  style,
  ...rest
}: CardItemProps<T>) {
  const Component = as || 'div';
  const { isMouseEntered } = useMouseEnter();

  const toValue = (val: number | string, unit = 'px') => {
    return typeof val === 'number' ? `${val}${unit}` : val;
  };

  const transform = isMouseEntered
    ? `translate3d(${toValue(translateX)}, ${toValue(translateY)}, ${toValue(translateZ)}) rotateX(${toValue(rotateX, 'deg')}) rotateY(${toValue(rotateY, 'deg')}) rotateZ(${toValue(rotateZ, 'deg')})`
    : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';

  return (
    <Component
      className={`hwi-3d-card-item ${className}`}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
