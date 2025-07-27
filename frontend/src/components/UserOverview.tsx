import ButtonLink from './common/ButtonLink';

export default function UserOverview() {
  return (
    <div className="card list">
      <ButtonLink to="/wordList">Slovíčka</ButtonLink>
      <ButtonLink to="/grammarList">Gramatika</ButtonLink>
    </div>
  );
}
