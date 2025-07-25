import ButtonLink from './common/ButtonLink';

export default function UserOverview() {
  return (
    <div className="card-list">
      {/* <ButtonLink to="/wordList " className="button-rectangular">
        Slovíčka
      </ButtonLink> */}
      <ButtonLink to="/grammarList " className="button-rectangular">
        Gramatika
      </ButtonLink>
    </div>
  );
}
