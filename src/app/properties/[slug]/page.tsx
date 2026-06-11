// generateStaticParams lives here (server component wrapper)
// The actual client UI is in PropertyDetailPage below (marked "use client")

import { properties } from "@/lib/data";
import PropertyDetailPage from "./PropertyDetailPage";

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <PropertyDetailPage slug={params.slug} />;
}
