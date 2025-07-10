"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (session) {
      router.replace("/backoffice");
    } else {
      router.replace("/sign-in");
    }
  }, [session, isPending, router]);

  return null;
}
