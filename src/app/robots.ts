import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/account/',
        '/dashboard/',
        '/debug/',
        '/diagnosis/result/',
        '/_next/',
        '/private/',
        '*.json'
      ],
    },
    sitemap: 'https://lival.ai/sitemap.xml',
    host: 'https://lival.ai'
  }
}