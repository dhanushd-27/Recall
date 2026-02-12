import { getContent } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

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
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {data.content}
      </ReactMarkdown>
      <p className="text-sm text-muted-foreground pt-8 border-t mt-10">
        If you liked it, follow the creator on{" "}
        <Link
          href="https://www.linkedin.com/in/dhanush27/"
          className="text-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </Link>{" "}
        and{" "}
        <Link
          href="https://x.com/orcatwt"
          className="text-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </Link>
        .
      </p>
    </article>
  );
}
