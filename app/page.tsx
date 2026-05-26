import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: books, error } = await supabase
    .from("books")
    .select("id, name, author_name, slug, description, cover_image_url")
    .eq("publication_status", "published")
    .limit(10);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-3xl font-bold mb-12 text-center border-b pb-6">Tuyển tập truyện ngắn</h2>
      {error && <p className="text-red-500 text-center">Lỗi hệ thống: {error.message}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {books?.map((book) => (
          <article key={book.id} className="group flex gap-6">
            {book.cover_image_url && (
              <div className="w-24 h-32 flex-shrink-0 bg-muted overflow-hidden">
                <img src={book.cover_image_url} alt={book.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div>
              <a href={`/truyen/${book.slug}`} className="block">
                <h3 className="text-xl font-bold group-hover:underline">{book.name}</h3>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mt-1">{book.author_name}</p>
                <p className="mt-3 text-base leading-relaxed line-clamp-3 text-muted-foreground">{book.description}</p>
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
