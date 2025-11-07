import { useCallback, useState } from "react";
import { MobileNavbar } from "../navbar/mobile-navbar";
import { MobileSidebar } from "../sidebar/mobile-sidebar";

export const MobileProductView = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const openMenu = useCallback(() => setOpenSidebar(true), []);
  const closeMenu = useCallback(() => setOpenSidebar(false), []);
  return (
    <>
      <MobileNavbar onOpenMenu={openMenu} />
      <MobileSidebar open={openSidebar} onClose={closeMenu} />

      <div className="min-h-screen bg-zinc-200"></div>
    </>
  );
};
