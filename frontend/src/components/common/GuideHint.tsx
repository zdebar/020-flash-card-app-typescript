export default function GuideHint({
  visibility,
  text,
  style,
}: {
  visibility: boolean;
  text?: string;
  style?: React.CSSProperties;
}) {
  return (
    visibility && (
      <p
        className="color-guide absolute z-20 pt-6"
        style={{
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          ...style,
        }}
      >
        {text}
      </p>
    )
  );
}
