import ButtonOld from './common/ButtonOld';

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
      <ButtonOld onClick={onNext} className="">
        Procvičovat
      </ButtonOld>
    </div>
  );
}
