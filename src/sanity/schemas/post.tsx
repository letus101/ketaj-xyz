import * as React from 'react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      description:
        'Controls display ordering. Defaults to now. Edit this when backdating older posts during migration.',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Code', value: 'code' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule: any) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  },
                ],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
        { type: 'codeBlock' },
        { type: 'terminalBlock' },
        { type: 'imageLightbox' },
      ],
    }),
    defineField({
      name: 'markdownBody',
      title: 'Markdown Body (Optional)',
      description: (
        <div style={{ marginTop: '0.5rem' }}>
          <p>If you prefer writing in Markdown, use this field instead of the rich text Body above.</p>
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f4f6f8', color: '#1f2937', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
            <strong>💡 MDX Helper: Password Spoiler</strong>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Copy and paste this snippet into your markdown to create a password-protected block:</p>
            <pre style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '4px', fontSize: '0.8rem', overflowX: 'auto' }}>
{`<Spoiler title="Local.txt Flag" password="HTB{flag_here}">
  Your hidden markdown content goes here!
</Spoiler>`}
            </pre>
          </div>
        </div>
      ) as any,
      type: 'markdown',
    }),
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, author, media, date }) {
      const d = date ? new Date(date).toLocaleDateString() : 'No date';
      return {
        title,
        subtitle: `${d} — ${author || 'No author'}`,
        media,
      };
    },
  },
});
