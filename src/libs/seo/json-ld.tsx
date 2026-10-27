// NOTE: This is sample code, do not use it until you refactor it.
// import { absoluteUrl } from "@/libs/seo/url";

// type BlogPost = {
//   title: string;
//   excerpt: string;
//   slug: string;
//   ogImage?: string;
//   publishedAt: string;
//   updatedAt: string;
//   author: {
//     name: string;
//   };
// };

// function safeJsonLd(data: unknown) {
//   return JSON.stringify(data).replace(/</g, "\\u003c");
// }

// export function BlogPostingJsonLd({ post }: { post: BlogPost }) {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "BlogPosting",
//     headline: post.title,
//     description: post.excerpt,
//     image: absoluteUrl(post.ogImage ?? "/og/blog-default.png"),
//     datePublished: post.publishedAt,
//     dateModified: post.updatedAt,
//     author: {
//       "@type": "Person",
//       name: post.author.name,
//     },
//     mainEntityOfPage: {
//       "@type": "WebPage",
//       "@id": absoluteUrl(`/blog/${post.slug}`),
//     },
//   };

//   return (
//     <script
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{
//         __html: safeJsonLd(jsonLd),
//       }}
//     />
//   );
// }
