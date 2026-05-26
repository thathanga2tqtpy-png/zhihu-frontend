import { supabase } from "@/lib/supabase";
import { CommentSection } from "@/components/comment-section";
import { ReadingSettings } from "@/components/reading-settings";
import { notFound } from "next/navigation";
import { Eye, BookmarkPlus, Tag } from "lucide-react";
import { FollowButton } from "@/components/follow-button";

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!book) notFound();

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      {/* Header Info */}
      <header className="mb-10 space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold font-serif leading-tight">{book.name}</h1>
          <div className="flex items-center gap-2">
            <ReadingSettings />
            <FollowButton bookId={book.id} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Tác giả: {book.author_name}</p>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
            <Tag className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wide text-[11px] font-bold">{book.genre}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{book.view_count?.toLocaleString()} lượt xem</span>
          </div>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none leading-[1.8] whitespace-pre-wrap font-serif">
        {book.content}
      </div>
      
      <hr className="my-12" />
      <CommentSection bookId={book.id} />
    </article>
  );
}
