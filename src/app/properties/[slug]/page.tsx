import { properties } from "@/lib/data";
import PropertyDetailPage from "./PropertyDetailPage";

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PropertyDetailPage slug={slug} />;
}
