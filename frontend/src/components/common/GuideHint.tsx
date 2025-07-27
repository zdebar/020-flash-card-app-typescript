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
        className="font-Mansalva absolute z-20"
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
