import ButtonLink from './common/ButtonLink';
import ButtonReset from './common/ButtonReset';
import { useUser } from '../hooks/useUser';
import TopBar from './common/TopBar';
import config from '../config/config';

export default function UserOverview() {
  const { languageId } = useUser();
  const selectedLanguage = config.languages.find(
    (lang) => lang.id === languageId
  );
  return (
    <div className="w-card list">
      <TopBar text="Přehled" toLink="/userDashboard" />
      <ButtonLink to="/wordList">Slovíčka</ButtonLink>
      <ButtonLink to="/grammarList">Gramatika</ButtonLink>
      <ButtonLink to="/grammarPracticeList">Gramatická cvičení</ButtonLink>
      <ButtonReset
        apiPath={`/api/users/language/${languageId}`}
        modalMessage={`Opravdu chcete restartovat jazyk ${selectedLanguage?.name} ? Veškerý pokrok bude ztracen.`}
      >
        Restart
      </ButtonReset>
    </div>
  );
}
