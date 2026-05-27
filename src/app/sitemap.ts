import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://niemvuithoangqua.vn'

  // 1. Lấy danh sách tất cả các bộ truyện đã xuất bản
  const { data: books } = await supabase
    .from('books')
    .select('slug, updated_at')
    .eq('publication_status', 'published')

  const bookUrls = (books || []).map((book) => ({
    url: `${baseUrl}/truyen/${book.slug}`,
    lastModified: new Date(book.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 2. Các trang tĩnh chính
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  return [...staticUrls, ...bookUrls]
}
