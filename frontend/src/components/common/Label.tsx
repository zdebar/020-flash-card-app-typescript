interface LabelProps {
  text: string;
}

export default function Label({ text }: LabelProps) {
  return <p className="inline-block w-25 flex-shrink-0">{text}</p>;
}
