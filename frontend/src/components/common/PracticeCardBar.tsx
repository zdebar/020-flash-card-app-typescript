import React from 'react';
import config from '../../config/config';
import { getBarColor } from '../../utils/graph.utils';

const BLOCKS_PER_FILL = config.blockFillSize;
const MAX_BLOCKS = 20;

interface PracticeCardBarProps {
  blocks: number;
  className?: string;
}

function BarComponent({ blocks, className }: PracticeCardBarProps) {
  const level = Math.min(Math.floor(blocks / BLOCKS_PER_FILL), MAX_BLOCKS);
  const subLevel = blocks - level * BLOCKS_PER_FILL;

  return (
    <div
      className={`color-disabled color-text h-full ${className} flex justify-center border-r-1`}
      role="progressbar"
      aria-label="Úroveň pokroku"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={MAX_BLOCKS}
      title={`Úroveň: ${level} z ${MAX_BLOCKS}`}
    >
      {[...Array(MAX_BLOCKS)].map((_, idx) => {
        const filled = idx < level;
        const color = getBarColor(idx + 1);

        if (idx === level) {
          return (
            <div className="flex flex-col" key={idx}>
              <div
                className="h-full w-2 border-l-1"
                style={{
                  height: `${((BLOCKS_PER_FILL - subLevel) / BLOCKS_PER_FILL) * 100}%`,
                }}
              ></div>
              <div
                className={`h-full w-2 border-l-1 ${color}`}
                style={{ height: `${(subLevel / BLOCKS_PER_FILL) * 100}%` }}
              ></div>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className={`h-full w-2 border-l-1${filled && color ? ` ${color}` : ''}`}
          ></div>
        );
      })}
    </div>
  );
}

export const PracticeCardBar = React.memo(BarComponent);
