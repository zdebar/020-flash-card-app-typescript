import { useUser } from '../../hooks/useUser';
import { UserIcon } from './Icons';

export default function UserAvatar({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name?: string;
}) {
  const { userInfo } = useUser();

  const finalImageUrl = imageUrl ?? userInfo?.picture;
  const finalName = name ?? userInfo?.name;
  const initials = finalName ? finalName[0] : null;

  return finalImageUrl ? (
    <img src={finalImageUrl} alt="User Avatar" className="h-D rounded-full" />
  ) : initials ? (
    <div className="h-D flex items-center justify-center rounded-full text-3xl">
      <span className="text-3xl font-bold">{initials}</span>
    </div>
  ) : (
    <UserIcon />
  );
}
