"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase
      .from("books")
      .select("*")
      .ilike("name", `%${query}%`);
    setResults(data || []);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8">Tìm kiếm truyện</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-12">
        <Input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Nhập tên truyện..." 
        />
        <Button type="submit">Tìm</Button>
      </form>
      <div className="space-y-6">
        {results.map((book) => (
          <a key={book.id} href={`/truyen/${book.slug}`} className="block border-b pb-4 hover:bg-muted p-2 rounded">
            <h3 className="text-lg font-bold">{book.name}</h3>
            <p className="text-sm text-muted-foreground">{book.author_name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
