interface OverlayProps {
  isVisible: boolean;
  isRevealed?: boolean;
  onClose: () => void;
}

export default function Overlay({
  isVisible,
  onClose,
  isRevealed,
}: OverlayProps) {
  if (!isVisible) return null;
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div
      className="card font-display absolute z-1 text-xl"
      role="dialog"
      style={{
        backgroundColor: !isDarkMode
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(17, 24, 39, 0.6)',
      }}
      aria-modal="true"
      onClick={onClose}
    >
      {isRevealed ? (
        <div className="max-w-md">
          <p
            className="absolute text-center"
            style={{
              top: '65px',
              left: '15px',
            }}
          >
            Vyslovte slovíčko či větu alespoň jednou nahlas. Lépe vícekrát.
          </p>
          <p
            className="absolute text-center"
            style={{
              top: '200px',
              left: '15px',
            }}
          >
            Stikněte plus, jen pokud jste si zcela jisti svojí znalostí .
          </p>
        </div>
      ) : (
        <div className="max-w-md">
          <p
            className="absolute"
            style={{
              top: '0px',
              left: '10px',
            }}
          >
            přehrát zvuk
          </p>
          <p
            className="absolute"
            style={{
              top: '30px',
              left: '80px',
            }}
          >
            100 denních bloků
          </p>
          <p
            className="absolute"
            style={{
              top: '0px',
              left: '225px',
            }}
          >
            gramatika
          </p>
          <p
            className="absolute"
            style={{
              top: '100px',
              left: '190px',
            }}
          >
            pokrok v bloku
          </p>
          <p
            className="absolute"
            style={{
              top: '100px',
              left: '5px',
            }}
          >
            hlasitost
          </p>
          <p
            className="absolute"
            style={{
              top: '200px',
              left: '5px',
            }}
          >
            pokrok slovíčka
          </p>
          <p
            className="absolute"
            style={{
              top: '290px',
              left: '5px',
            }}
          >
            nápověda
          </p>
          <p
            className="absolute"
            style={{
              top: '290px',
              left: '190px',
            }}
          >
            odhalit překlad
          </p>
        </div>
      )}
    </div>
  );
}
