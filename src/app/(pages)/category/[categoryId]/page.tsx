import { CategoryView } from "@/modules/structure/components/category/category-view";

const Page = ({ params }: { params: { categoryId: string } }) => {
  return (
    <div>
      <CategoryView categoryId={params.categoryId} />
    </div>
  );
};

export default Page;
