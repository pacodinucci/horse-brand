import { TfView } from "@/modules/structure/components/checkout/tf-view";

type PageProps = {
  searchParams?: { orderId?: string };
};

export default function Page({ searchParams }: PageProps) {
  const orderId = searchParams?.orderId ?? null;
  return <TfView orderId={orderId} />;
}
