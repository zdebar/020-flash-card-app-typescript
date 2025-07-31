import ButtonLink from './common/ButtonLink';
import ButtonReset from './common/ButtonReset';
import { useUser } from '../hooks/useUser';
import TopBar from './common/TopBar';

export default function UserOverview() {
  const { languageID } = useUser();
  return (
    <div className="card list">
      <TopBar text="Přehled" toLink="/userDashboard" />
      <ButtonLink to="/wordList">Slovíčka</ButtonLink>
      <ButtonLink to="/grammarList">Gramatika</ButtonLink>
      <ButtonReset
        apiPath={`/api/users/language/${languageID}`}
        modalMessage={`Opravdu chcete restartovat jazyk ${languageID} ? Veškerý pokrok bude ztracen.`}
        disabled={true} // Temporarily disable the button
      >
        Restart
      </ButtonReset>
    </div>
  );
}
