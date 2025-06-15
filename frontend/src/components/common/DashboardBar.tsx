import config from '../../config/config';
import { getBarColor } from '../../utils/graph.utils';

const BLOCKS_PER_FILL = config.blockFillSize; // Number of blocks to fill in the progress bar
const MAX_BLOCKS = 20;

export default function DashboardBar({ blocks }: { blocks: number }) {
  const level = Math.min(Math.floor(blocks / BLOCKS_PER_FILL), MAX_BLOCKS);

  return (
    <div className="color-disabled flex w-40 justify-center border-r-1 border-white">
      {[...Array(MAX_BLOCKS)].map((_, idx) => {
        const filled = idx < level;
        const color = getBarColor(idx + 1);

        return (
          <div
            key={idx}
            className={`h-2 w-2 ${filled ? color : ''} border-l-1 border-white`}
            aria-label="Úroveň pokroku"
            aria-valuenow={level}
            aria-valuemin={0}
            aria-valuemax={MAX_BLOCKS}
          ></div>
        );
      })}
    </div>
  );
}
