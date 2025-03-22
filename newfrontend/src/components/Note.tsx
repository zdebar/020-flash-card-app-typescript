export default function Note() {
  return (
    <button className="btn w-full max-w-xs shadow-xl bg-gray-100 text-center h-[120px] flex flex-col items-center">
      <p className="text-xl font-bold h-[35px] flex items-center">src</p>
      <div className="text-l">
        <p className="h-[25px] flex items-center">trg</p>
        <p className="h-[25px] flex items-center">prn</p>
      </div>
    </button>
  );
}
