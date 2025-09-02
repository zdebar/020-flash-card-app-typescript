import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { UserIcon } from './Icons';

export default function UserAvatar() {
  const { userInfo } = useUser();

  const finalImageUrl = userInfo?.picture;
  const initials = userInfo?.name?.[0] ?? null;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (finalImageUrl) {
      const img = new Image();
      img.src = finalImageUrl;
      img.onload = () => setIsImageLoaded(true);
      img.onerror = () => setIsImageLoaded(false);
    }
  }, [finalImageUrl]);

  return isImageLoaded ? (
    <img
      src={finalImageUrl ?? undefined}
      alt="User Avatar"
      className="h-D rounded-full"
    />
  ) : initials ? (
    <div
      className="h-D w-D flex items-center justify-center rounded-full bg-[var(--color-green-0)]"
      style={{ paddingBottom: '1.5px' }}
    >
      <span className="text-2xl text-white">{initials}</span>
    </div>
  ) : (
    <UserIcon />
  );
}
