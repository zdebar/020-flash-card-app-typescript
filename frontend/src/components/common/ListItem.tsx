import Button from './Button';
import { ButtonHTMLAttributes } from 'react';
import { Item } from '../../../../shared/types/dataTypes';

interface ListItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  item: Item;
}

export function ListItem({ item, ...props }: ListItemProps) {
  return (
    <div className="flex h-6 items-center gap-2">
      <Button
        key={item.id}
        className="h-6 rounded-none shadow-none"
        buttonColor="button-secondary"
        {...props}
      >
        <div className="flex w-full items-center justify-between px-4">
          <span className="w-1/2 truncate text-left">{item.english}</span>
          <span className="w-1/2 truncate text-left">{item.czech}</span>
        </div>
      </Button>
    </div>
  );
}
