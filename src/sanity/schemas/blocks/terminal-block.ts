import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'terminalBlock',
  title: 'Terminal / Console Output',
  type: 'object',
  fields: [
    defineField({
      name: 'command',
      title: 'Command',
      type: 'string',
      description: 'The command that was run (shown with a prompt prefix).',
    }),
    defineField({
      name: 'output',
      title: 'Output',
      type: 'text',
      rows: 15,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { command: 'command', output: 'output' },
    prepare({ command, output }) {
      return {
        title: command ? `$ ${command}` : 'Terminal Output',
        subtitle: output ? output.substring(0, 80) + '…' : '',
      };
    },
  },
});
