import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const CartHeader = () => {
  return (
    <div className="flex items-center justify-center w-full relative">
      <div className="absolute top-10 left-0 flex items-center gap-2">
        <ArrowLeft />
        Volver
      </div>
      <div>
        <Image
          src={"/logos/HB main positivo.svg"}
          alt={"Horse Brand Logo"}
          width={100}
          height={0}
        />
      </div>
    </div>
  );
};
