import { useUser } from '../../hooks/useUser';
import { UserIcon } from './Icons';

export default function UserAvatar() {
  const { userInfo } = useUser();

  const finalImageUrl = userInfo?.picture;
  const initials = userInfo?.name?.[0] ?? null;

  return finalImageUrl ? (
    <img src={finalImageUrl} alt="User Avatar" className="h-D rounded-full" />
  ) : initials ? (
    <div
      className="h-D w-D flex items-center justify-center rounded-full bg-[var(--color-green-0)]"
      style={{ paddingBottom: '1.5px', paddingLeft: '2px' }}
    >
      <span className="text-2xl dark:text-white">{initials}</span>
    </div>
  ) : (
    <UserIcon />
  );
}
