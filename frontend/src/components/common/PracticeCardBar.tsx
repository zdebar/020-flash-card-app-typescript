import React from 'react';
import config from '../../config/config';
import { getColor } from '../../utils/graph.utils';

const BLOCKS_PER_FILL = config.blockFillSize; // Number of blocks to fill in the progress bar

function BarComponent({ blocks }: { blocks: number }) {
  const level = Math.min(Math.floor(blocks / BLOCKS_PER_FILL), 20);
  const subLevel = blocks - level * BLOCKS_PER_FILL;

  return (
    <div className="color-disabled color-text flex w-40 justify-center border-r-1">
      {[...Array(20)].map((_, idx) => {
        const filled = idx < level;
        const color = getColor(idx + 1);

        if (idx === level) {
          return (
            <div className="flex flex-col" key={idx}>
              <div
                className="border-l-1"
                style={{
                  height: `${((5 - subLevel) / BLOCKS_PER_FILL) * 100}%`,
                }}
              ></div>
              <div
                className={`w-2 border-l-1 ${color}`}
                style={{ height: `${(subLevel / BLOCKS_PER_FILL) * 100}%` }}
              ></div>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className={`h-12 w-2 ${filled ? color : ''} border-l-1`}
          ></div>
        );
      })}
    </div>
  );
}

// Wrap the component with React.memo
export const PracticeCardBar = React.memo(BarComponent);
