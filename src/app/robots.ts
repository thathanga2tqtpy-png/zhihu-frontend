import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://niemvuithoangqua.vn'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/register', '/profile', '/bookmarks', '/settings'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
