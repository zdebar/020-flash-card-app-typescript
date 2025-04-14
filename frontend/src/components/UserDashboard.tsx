import { useUser } from '../hooks/useUser';
import Button from './Button';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const { userInfo, setUserInfo, setLoading } = useUser();

  return (
    <div className="w-[320px]">
      <Button to="/practice" disabled={!userInfo} className="rounded-full">
        <AcademicCapIcon className="size-5.5" />
      </Button>
      <p></p>
      <p></p>
    </div>
  );
}
