import LanguageDropdown from './common/LanguageDropdown.js';

export default function UserLanguages() {
  return (
    <div className="list card">
      <LanguageDropdown className="px-2" />
      <p className="notice">
        angličtina obsahuje cca. 10k slovíček a 5 bloků gramatiky, španělština
        cca. 1k slovíček, němčina je prázdná
      </p>
    </div>
  );
}
