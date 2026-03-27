import { randomUUID } from 'crypto';
import type { Feed } from './types';

export const DEFAULT_FEEDS: Feed[] = [
  { id: randomUUID(), name: 'Towards Data Science',    url: 'https://towardsdatascience.com/feed',                       category: 'Data Science',      weight: 5, enabled: true },
  { id: randomUUID(), name: 'KDnuggets',               url: 'https://www.kdnuggets.com/feed',                            category: 'Data Science',      weight: 5, enabled: true },
  { id: randomUUID(), name: 'Analytics Vidhya',        url: 'https://www.analyticsvidhya.com/feed/',                     category: 'Data Science',      weight: 4, enabled: true },
  { id: randomUUID(), name: 'Power BI Blog',           url: 'https://powerbi.microsoft.com/en-us/blog/feed/',            category: 'Power BI',          weight: 5, enabled: true },
  { id: randomUUID(), name: 'Microsoft Fabric Blog',   url: 'https://blog.fabric.microsoft.com/en-US/blog/feed/',        category: 'Power BI',          weight: 5, enabled: true },
  { id: randomUUID(), name: 'Tableau Blog',            url: 'https://www.tableau.com/rss.xml',                           category: 'Visualisation',     weight: 4, enabled: true },
  { id: randomUUID(), name: 'Python Blog',             url: 'https://blog.python.org/feeds/posts/default',               category: 'Python',            weight: 4, enabled: true },
  { id: randomUUID(), name: 'Real Python',             url: 'https://realpython.com/atom.xml',                           category: 'Python',            weight: 5, enabled: true },
  { id: randomUUID(), name: 'Hacker News (best)',      url: 'https://news.ycombinator.com/rss',                          category: 'General Tech',      weight: 3, enabled: true },
  { id: randomUUID(), name: 'r/datascience',           url: 'https://www.reddit.com/r/datascience/.rss',                 category: 'Community',         weight: 3, enabled: true },
  { id: randomUUID(), name: 'r/MachineLearning',       url: 'https://www.reddit.com/r/MachineLearning/.rss',             category: 'ML/AI',             weight: 4, enabled: true },
  { id: randomUUID(), name: 'r/PowerBI',               url: 'https://www.reddit.com/r/PowerBI/.rss',                     category: 'Power BI',          weight: 3, enabled: true },
  { id: randomUUID(), name: 'Google AI Blog',          url: 'https://blog.research.google/feeds/posts/default',          category: 'ML/AI',             weight: 4, enabled: true },
  { id: randomUUID(), name: 'MIT Tech Review (AI)',    url: 'https://www.technologyreview.com/feed/',                    category: 'ML/AI',             weight: 4, enabled: true },
  { id: randomUUID(), name: 'The Batch (deeplearning.ai)', url: 'https://www.deeplearning.ai/the-batch/feed/',           category: 'ML/AI',             weight: 5, enabled: true },
  { id: randomUUID(), name: 'Data Elixir',             url: 'https://dataelixir.com/issues.rss',                         category: 'Newsletter',        weight: 3, enabled: true },
  { id: randomUUID(), name: 'Practical Business Python', url: 'https://pbpython.com/feeds/all.atom.xml',                 category: 'Python',            weight: 4, enabled: true },
  { id: randomUUID(), name: 'Mode Analytics Blog',     url: 'https://mode.com/blog/rss.xml',                             category: 'Analytics',         weight: 3, enabled: true },
  { id: randomUUID(), name: 'dbt Blog',                url: 'https://www.getdbt.com/blog/rss.xml',                       category: 'Data Engineering',  weight: 4, enabled: true },
  { id: randomUUID(), name: 'Flowing Data',            url: 'https://flowingdata.com/feed',                              category: 'Visualisation',     weight: 3, enabled: true },
];
