import config from '../../config/config';
import { getColor } from '../../utils/graph.utils';

const BLOCKS_PER_FILL = config.blockFillSize; // Number of blocks to fill in the progress bar

export default function BarFill({ blocks }: { blocks: number }) {
  const level = Math.min(Math.floor(blocks / BLOCKS_PER_FILL), 20);

  return (
    <div className="color-disabled color-text flex w-40 justify-center border-r-1">
      {[...Array(20)].map((_, idx) => {
        const filled = idx < level;
        const color = getColor(idx + 1);

        return (
          <div
            key={idx}
            className={`h-2 w-2 ${filled ? color : ''} border-l-1`}
          ></div>
        );
      })}
    </div>
  );
}
