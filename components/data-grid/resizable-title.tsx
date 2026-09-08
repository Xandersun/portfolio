"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ThHTMLAttributes } from "react";

interface ResizableTitleProps extends ThHTMLAttributes<HTMLTableCellElement> {
  width?: number;
  onResize?: (width: number) => void;
}

const MIN_COLUMN_WIDTH = 72;

export function ResizableTitle({ width, onResize, style, children, ...rest }: ResizableTitleProps) {
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const delta = event.clientX - startXRef.current;
      onResize?.(Math.max(MIN_COLUMN_WIDTH, startWidthRef.current + delta));
    },
    [onResize],
  );

  const stopDragging = useCallback(() => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", stopDragging);
  }, [handlePointerMove]);

  const startDragging = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
      startXRef.current = event.clientX;
      startWidthRef.current = width ?? 120;
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopDragging);
    },
    [width, handlePointerMove, stopDragging],
  );

  if (!width || !onResize) {
    return (
      <th style={style} {...rest}>
        {children}
      </th>
    );
  }

  return (
    <th style={{ ...style, position: "relative", width }} {...rest}>
      {children}
      <span
        onPointerDown={startDragging}
        aria-hidden
        style={{
          position: "absolute",
          insetBlock: 0,
          insetInlineEnd: -4,
          width: 8,
          cursor: "col-resize",
          touchAction: "none",
          zIndex: 1,
        }}
      />
    </th>
  );
}
