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
        className="font-display absolute z-1 pt-6 text-xl"
        style={{
          whiteSpace: 'nowrap',
          ...style,
        }}
      >
        {text}
      </p>
    )
  );
}
