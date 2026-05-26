import { supabase } from "@/lib/supabase";
import { CommentSection } from "@/components/comment-section";
import { ReadingSettings } from "@/components/reading-settings";
import { notFound } from "next/navigation";
import { use } from "react";

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!book) notFound();

  return (
    <article className="max-w-3xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{book.name}</h1>
        <ReadingSettings />
      </div>
      <p className="text-muted-foreground italic mb-8">Tác giả: {book.author_name}</p>
      <div className="prose prose-lg dark:prose-invert max-w-none leading-[1.8] whitespace-pre-wrap">
        {book.content}
      </div>
      <CommentSection bookId={book.id} />
    </article>
  );
}
