import HermesLandingSkeleton from "@/modules/structure/components/hermes-landing-skeleton";
import { getCategoriesForNavbar } from "@/modules/structure/components/navbar/server";

const HermesStructurePage = async () => {
  const categoriesResult = await getCategoriesForNavbar();
  const categories = categoriesResult.items ?? [];

  return <HermesLandingSkeleton categories={categories} />;
};

export default HermesStructurePage;
