import { getQueryClient, trpc } from "@/trpc/server";
import {
  LandingView,
  LandingViewErrorState,
  LandingViewLoadingState,
} from "@/modules/landing/ui/views/landing-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Navbar } from "@/modules/landing/ui/components/navbar";

// import { authClient } from "@/lib/auth-client";

export const dynamic = "force-dynamic";

export default function Home() {
  // const router = useRouter();
  // const { data: session, isPending } = authClient.useSession();

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({}));

  return (
    <>
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LandingViewLoadingState />}>
          <ErrorBoundary errorComponent={LandingViewErrorState}>
            <LandingView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
