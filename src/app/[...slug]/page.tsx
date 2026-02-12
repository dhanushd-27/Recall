import { getContent } from "@/lib/content";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const data = await getContent(slug);

  if (!data) {
    return notFound();
  }

  // Format title from slug similar to sidebar if meta title is missing
  const title =
    data.meta.title ||
    slug[slug.length - 1]
      .replace(/^\d+_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto py-10 px-6">
      <h1 className="mb-8">{title}</h1>
      <ReactMarkdown rehypePlugins={[rehypeSlug]}>{data.content}</ReactMarkdown>
    </article>
  );
}
