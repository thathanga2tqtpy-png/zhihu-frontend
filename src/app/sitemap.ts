import { MetadataRoute } from 'next'
import { BookService } from '@/services/book.service'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://niemvuithoangqua.vn'

  // 1. Các trang tĩnh chính
  const staticPaths = [
    '',
    '/search',
    '/the-loai',
    '/truyen-moi',
    '/truyen-hot',
    '/truyen-full',
  ]

  const staticUrls = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.9,
  }))

  // 2. Danh sách các thể loại
  const { data: genres } = await supabase.from('genres').select('slug, created_at')
  const genreUrls = (genres || []).map((genre) => ({
    url: `${baseUrl}/the-loai/${genre.slug}`,
    lastModified: genre.created_at ? new Date(genre.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 3. Danh sách các bộ truyện
  const { data: books } = await BookService.getAllPublishedBooks()
  const bookUrls = (books || []).map((book) => ({
    url: `${baseUrl}/truyen/${book.slug}`,
    lastModified: new Date(book.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // 4. Danh sách các chương truyện
  const { data: chapters } = await supabase
    .from('chapters')
    .select('chapter_number, updated_at, books!inner(slug, publication_status)')
    .eq('books.publication_status', 'published')
    
  const chapterUrls = (chapters || []).map((chapter: any) => ({
    url: `${baseUrl}/truyen/${chapter.books?.slug}/${chapter.chapter_number}`,
    lastModified: new Date(chapter.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticUrls, ...genreUrls, ...bookUrls, ...chapterUrls]
}
