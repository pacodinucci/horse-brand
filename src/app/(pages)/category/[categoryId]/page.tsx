import { CategoryView } from "@/modules/structure/components/category/category-view";

type PageProps = {
  params: {
    categoryId: string;
  };
  searchParams?: {
    subcategoryId?: string;
  };
};

const Page = ({ params, searchParams }: PageProps) => {
  return (
    <div>
      <CategoryView
        categoryId={params.categoryId}
        subcategoryId={searchParams?.subcategoryId}
      />
    </div>
  );
};

export default Page;
