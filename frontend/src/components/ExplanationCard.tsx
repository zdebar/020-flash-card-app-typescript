import Button from './common/Button';

export default function ExplanationCard({
  explanation,
  onNext,
}: {
  explanation: string;
  onNext: () => void;
}) {
  return (
    <div className="color-secondary-disabled flex h-[320px] w-[320px] flex-col items-center justify-between gap-1">
      <div
        dangerouslySetInnerHTML={{ __html: explanation }}
        className="py-4"
      ></div>
      <Button onClick={onNext} className="">
        Procvičovat
      </Button>
    </div>
  );
}
