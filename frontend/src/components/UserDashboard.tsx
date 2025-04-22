import RectangularButton from './RectangularButton';
import Dashboard from './Dashboard';

export default function UserDashboard() {
  return (
    <div className="w-[320px]">
      <RectangularButton to="/practice">slovíčka</RectangularButton>
      <RectangularButton to="/grammar">gramatika</RectangularButton>
      <Dashboard></Dashboard>
      <p></p>
    </div>
  );
}
