import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Thể loại | Niềm Vui Thoáng Qua",
  description: "Khám phá các thể loại truyện ngắn đặc sắc.",
};

export default async function GenresPage() {
  const { data: genres } = await supabase
    .from("genres")
    .select("*")
    .order("name");

  // Filter main genres
  const mainGenreSlugs = ["ngon-tinh", "dam-my", "bach-hop"];
  const mainGenres = genres?.filter((g) => mainGenreSlugs.includes(g.slug)) || [];
  const otherGenres = genres?.filter((g) => !mainGenreSlugs.includes(g.slug)) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      <div className="mb-12 border-b pb-6">
        <h1 className="text-3xl md:text-4xl font-serif italic font-bold mb-3 text-primary">
          Khám phá Thể loại
        </h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Tuyển chọn theo từng góc nhìn và cảm xúc
        </p>
      </div>

      {/* Main Genres Section */}
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
          Thể loại chính
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mainGenres.map((genre) => (
            <Link
              key={genre.id}
              href={`/the-loai/${genre.slug}`}
              className="group block p-6 border rounded-xl hover:border-primary hover:shadow-md transition-all bg-card relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {genre.description || "Thể loại được yêu thích nhất"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Other Genres Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-serif font-semibold mb-6">
          Tìm kiếm nâng cao
        </h2>
        <div className="flex flex-wrap gap-3">
          {otherGenres.map((genre) => (
            <Link
              key={genre.id}
              href={`/the-loai/${genre.slug}`}
              className="inline-flex items-center px-5 py-2.5 bg-muted/50 border rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md"
              title={genre.description || genre.name}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
