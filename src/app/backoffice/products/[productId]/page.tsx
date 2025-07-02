import { getQueryClient, trpc } from "@/trpc/server";

interface ProductIdPageProps {
  params: Promise<{ productId: string }>;
}

const ProductIdPage = async ({ params }: ProductIdPageProps) => {
  const { productId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );

  return <div>Product Page ID</div>;
};

export default ProductIdPage;
