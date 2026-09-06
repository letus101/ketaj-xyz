import { groq } from 'next-sanity';

// All posts, ordered by publishedAt descending (never _createdAt)
// Categories are expanded from references
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    body,
    markdownBody,
    categories[]->{ _id, title, slug },
    mainImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    author->{ name, slug, image }
  }
`;

// Posts filtered by category slug, ordered by publishedAt descending
export const postsByCategoryQuery = groq`
  *[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    body,
    markdownBody,
    categories[]->{ _id, title, slug },
    mainImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    author->{ name, slug, image }
  }
`;

// Related posts: find posts sharing at least one category, excluding current post
export const relatedPostsQuery = groq`
  *[_type == "post" && _id != $currentId && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    categories[]->{ _id, title, slug },
    mainImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    author->{ name, slug, image }
  }
`;

// Single post by slug — full body
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    categories[]->{ _id, title, slug },
    mainImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    author->{ name, slug, image },
    markdownBody,
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset->{ _id, url, metadata { dimensions } }
      },
      _type == "imageLightbox" => {
        ...,
        image {
          asset->{ _id, url, metadata { dimensions } },
        }
      }
    }
  }
`;

// All post slugs (for generateStaticParams)
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// All categories
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

// Author by slug
export const authorQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio
  }
`;

// About singleton (fetches the first/only "about" document)
export const aboutQuery = groq`
  *[_type == "about"][0] {
    heading,
    profileImage {
      asset->{ _id, url, metadata { dimensions } }
    },
    bio,
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset->{ _id, url, metadata { dimensions } }
      }
    },
    socials[] {
      platform,
      url
    }
  }
`;
