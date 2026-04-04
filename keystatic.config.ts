import { config, collection, fields } from '@keystatic/core';

const storage =
  process.env.KEYSTATIC_GITHUB_CLIENT_ID
    ? ({
        kind: 'github' as const,
        repo: {
          owner: process.env.GITHUB_REPO_OWNER as string,
          name: process.env.GITHUB_REPO_NAME as string,
        },
      })
    : ({ kind: 'local' as const });

export default config({
  storage,

  ui: {
    brand: { name: 'SD Blog CMS' },
  },

  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),

        status: fields.select({
          label: 'Status',
          defaultValue: 'draft',
          options: [
            { label: '📝 Draft', value: 'draft' },
            { label: '✅ Published', value: 'published' },
            { label: '🗓 Scheduled', value: 'scheduled' },
          ],
        }),

        date: fields.date({
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
        }),

        scheduledDate: fields.date({
          label: 'Scheduled Publish Date',
          description: 'Only used when Status is "Scheduled". Post goes live on this date.',
        }),

        topic: fields.select({
          label: 'Topic',
          defaultValue: 'data-storytelling',
          options: [
            { label: 'Power BI', value: 'power-bi' },
            { label: 'Data Storytelling', value: 'data-storytelling' },
            { label: 'SQL', value: 'sql' },
            { label: 'Python', value: 'python' },
            { label: 'Market Intelligence', value: 'market-intelligence' },
            { label: 'Machine Learning', value: 'machine-learning' },
            { label: 'Industry Trends', value: 'industry-trends' },
          ],
        }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags' },
        ),

        excerpt: fields.text({
          label: 'Excerpt',
          multiline: true,
          description: 'Shown as the article lede and used as the SEO meta description.',
        }),

        featured: fields.checkbox({
          label: 'Featured Post',
          description: 'Pins this post to the featured slot on the blog index.',
          defaultValue: false,
        }),

        dataPoints: fields.integer({
          label: 'Data Points',
          description: 'Number of data points backing this analysis (shown in KeyMetrics bar).',
        }),

        sources: fields.integer({
          label: 'Sources',
          description: 'Number of sources cited (shown in KeyMetrics bar).',
        }),

        insightScore: fields.number({
          label: 'Insight Score (0–10)',
          description: 'Editorial quality score shown in KeyMetrics bar.',
          validation: { min: 0, max: 10 },
        }),

        updated: fields.date({
          label: 'Last Updated',
          description: 'Leave blank to use Publish Date.',
        }),

        content: fields.mdx({
          label: 'Content',
          components: {},
        }),
      },
    }),
  },
});
