export default function GuideHint({
  visibility,
  text,
  style,
  className = '',
}: {
  visibility: boolean;
  text?: string | React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    visibility && (
      <p
        className={`note absolute z-20 ${className}`}
        style={{
          // whiteSpace: 'nowrap',
          pointerEvents: 'none',
          ...style,
        }}
      >
        {text}
      </p>
    )
  );
}
