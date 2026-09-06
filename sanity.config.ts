import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { markdownSchema } from 'sanity-plugin-markdown';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  basePath: '/studio',
  name: 'ketaj-studio',
  title: 'ketaj.xyz Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool(), visionTool(), markdownSchema()],
  schema: {
    types: schemaTypes,
  },
});
