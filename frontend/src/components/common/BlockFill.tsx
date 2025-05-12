import React from 'react';
import config from '../../config/config';

const BLOCKS_PER_FILL = config.blockFillSize; // Number of blocks to fill in the progress bar

const COLORS = [
  'bg-blue-400', // 1–5
  'bg-blue-500', // 6–10
  'bg-blue-600', // 11–15
  'bg-blue-700', // 16–20
];

function getColor(level: number) {
  if (level <= 5) return COLORS[0];
  if (level <= 10) return COLORS[1];
  if (level <= 15) return COLORS[2];
  return COLORS[3];
}

function BlockFillComponent({ blocks }: { blocks: number }) {
  const level = Math.min(Math.floor(blocks / BLOCKS_PER_FILL), 20);

  return (
    <div className="color-disabled flex flex-2 justify-center border-r-1">
      {[...Array(20)].map((_, idx) => {
        const filled = idx < level;
        const color = getColor(idx + 1);

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
export const BlockFill = React.memo(BlockFillComponent);
