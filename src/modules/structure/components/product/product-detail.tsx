export const ProductDetail = () => {
  return (
    <div
      className="
        sticky 
        top-20      /* punto donde se pega (debajo del navbar) */
        mt-24       /* punto donde arranca más abajo */
        flex flex-col gap-8 border-2 border-blue-500
      "
    >
      <div className="min-h-[70vh] min-w-[30vw] bg-stone-300/60"></div>
      <div className="min-h-[40vh] min-w-[30vw] bg-zinc-500/40"></div>
    </div>
  );
};
