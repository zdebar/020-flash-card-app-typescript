import ButtonLink from './common/ButtonLink';
import ButtonReset from './common/ButtonReset';
import { useUser } from '../hooks/useUser';
import TopBar from './common/TopBar';

export default function UserOverview() {
  const { languageId } = useUser();
  return (
    <div className="w-card list">
      <TopBar text="Přehled" toLink="/userDashboard" />
      <ButtonLink to="/wordList">Slovíčka</ButtonLink>
      <ButtonLink to="/grammarList">Gramatika</ButtonLink>
      <ButtonLink to="/grammarPracticeList">Gramatická cvičení</ButtonLink>
      <ButtonReset
        apiPath={`/api/users/language/${languageId}`}
        modalMessage={`Opravdu chcete restartovat jazyk ${languageId} ? Veškerý pokrok bude ztracen.`}
        disabled={true} // Temporarily disable the button
      >
        Restart
      </ButtonReset>
    </div>
  );
}
