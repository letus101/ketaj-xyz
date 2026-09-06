import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'C', value: 'c' },
          { title: 'C++', value: 'cpp' },
          { title: 'PowerShell', value: 'powershell' },
          { title: 'Python', value: 'python' },
          { title: 'Assembly (x86)', value: 'asm' },
          { title: 'VQL (Velociraptor)', value: 'vql' },
          { title: 'Bash / Shell', value: 'bash' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JSON', value: 'json' },
          { title: 'YAML', value: 'yaml' },
          { title: 'Plain Text', value: 'text' },
        ],
      },
      initialValue: 'python',
    }),
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
      description: 'Optional filename shown in the code block header tab.',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 20,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'highlightLines',
      title: 'Highlight Lines',
      type: 'string',
      description: 'Comma-separated line numbers or ranges to highlight, e.g. "3-5,8,12".',
    }),
  ],
  preview: {
    select: {
      language: 'language',
      filename: 'filename',
      code: 'code',
    },
    prepare({ language, filename, code }) {
      return {
        title: filename || `Code (${language || 'text'})`,
        subtitle: code ? code.substring(0, 80) + '…' : '',
      };
    },
  },
});
