// Helper to estimate reading time from a post object
export function estimateReadingTime(post: any): number {
  let text = '';

  // Extract text from Markdown
  if (post.markdownBody) {
    text += post.markdownBody;
  }

  // Extract text from Portable Text blocks
  if (post.body && Array.isArray(post.body)) {
    const ptText = post.body
      .filter((block: any) => block._type === 'block' && block.children)
      .map((block: any) => block.children.map((child: any) => child.text).join(''))
      .join(' ');
    text += ' ' + ptText;
  }

  // Count words (splitting by whitespace)
  const words = text.trim().split(/\s+/).length;
  
  // Average reading speed is ~200 words per minute
  const wpm = 200;
  const minutes = Math.ceil(words / wpm);

  return Math.max(1, minutes); // Always at least 1 min
}
