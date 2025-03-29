export default function Note() {
  return (
    <button className="w-full max-w-xs shadow-md active:shadow-none bg-gray-100 hover:bg-gray-200 text-center h-[120px] flex flex-col items-center rounded-lg justify-evenly pt-3 pb-2">
      <p className="text-lg font-bold h-[20px] flex items-center">src</p>
      <p className="h-[20px] flex items-center text-l">trg</p>
      <p className="h-[20px] flex items-center text-l">prn</p>
    </button>
  );
}
