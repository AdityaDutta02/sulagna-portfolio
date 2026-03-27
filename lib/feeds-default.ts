import type { Feed } from './types';

// Static feed definitions with hardcoded UUIDs to ensure stable references across restarts.
// Do not regenerate these IDs — they are stored in the database and external references.
export const DEFAULT_FEEDS: Feed[] = [
  { id: 'e6b20007-4ffa-4d0b-8bbc-ac54aaa18817', name: 'Towards Data Science',    url: 'https://towardsdatascience.com/feed',                       category: 'Data Science',      weight: 5, enabled: true },
  { id: '9f8199bd-5407-4831-b827-7ff27da9be5f', name: 'KDnuggets',               url: 'https://www.kdnuggets.com/feed',                            category: 'Data Science',      weight: 5, enabled: true },
  { id: 'e138b22d-84da-470e-aaca-12e0d52ae234', name: 'Analytics Vidhya',        url: 'https://www.analyticsvidhya.com/feed/',                     category: 'Data Science',      weight: 4, enabled: true },
  { id: 'b3e0fd32-58ca-4c1b-8948-78fdda60294e', name: 'Power BI Blog',           url: 'https://powerbi.microsoft.com/en-us/blog/feed/',            category: 'Power BI',          weight: 5, enabled: true },
  { id: 'c94714d1-3bba-4553-af09-d28c63711fcf', name: 'Microsoft Fabric Blog',   url: 'https://blog.fabric.microsoft.com/en-US/blog/feed/',        category: 'Power BI',          weight: 5, enabled: true },
  { id: '2b452643-817e-42b5-a704-9d10b2a28705', name: 'Tableau Blog',            url: 'https://www.tableau.com/rss.xml',                           category: 'Visualisation',     weight: 4, enabled: true },
  { id: '554ca956-ec53-4aa0-8b7d-981c3992baf6', name: 'Python Blog',             url: 'https://blog.python.org/feeds/posts/default',               category: 'Python',            weight: 4, enabled: true },
  { id: '6d9ff30c-765c-442b-aafd-96ca5af806cb', name: 'Real Python',             url: 'https://realpython.com/atom.xml',                           category: 'Python',            weight: 5, enabled: true },
  { id: 'df80d2fe-9f55-4a65-aefe-724bd8aaddf1', name: 'Hacker News (best)',      url: 'https://news.ycombinator.com/rss',                          category: 'General Tech',      weight: 3, enabled: true },
  { id: 'cab4c0c8-12b4-4672-b03a-1a5bf59933e6', name: 'r/datascience',           url: 'https://www.reddit.com/r/datascience/.rss',                 category: 'Community',         weight: 3, enabled: true },
  { id: 'a173573e-198a-4010-8f10-a792eca9a66c', name: 'r/MachineLearning',       url: 'https://www.reddit.com/r/MachineLearning/.rss',             category: 'ML/AI',             weight: 4, enabled: true },
  { id: 'bf3ee416-7a18-40f2-9344-d1b203e30bce', name: 'r/PowerBI',               url: 'https://www.reddit.com/r/PowerBI/.rss',                     category: 'Power BI',          weight: 3, enabled: true },
  { id: 'aa8f2797-639b-4591-ac60-eae8123707a4', name: 'Google AI Blog',          url: 'https://blog.research.google/feeds/posts/default',          category: 'ML/AI',             weight: 4, enabled: true },
  { id: '043493eb-5fd5-4bfe-ad17-c4ed6d4af455', name: 'MIT Tech Review (AI)',    url: 'https://www.technologyreview.com/feed/',                    category: 'ML/AI',             weight: 4, enabled: true },
  { id: 'f2650671-9060-435b-a800-033eb8b3b798', name: 'The Batch (deeplearning.ai)', url: 'https://www.deeplearning.ai/the-batch/feed/',           category: 'ML/AI',             weight: 5, enabled: true },
  { id: '765ec9e0-189a-42ea-a036-f082d6ccd121', name: 'Data Elixir',             url: 'https://dataelixir.com/issues.rss',                         category: 'Newsletter',        weight: 3, enabled: true },
  { id: 'abf4fe90-f0c5-4ea8-93a3-856d379b87ea', name: 'Practical Business Python', url: 'https://pbpython.com/feeds/all.atom.xml',                 category: 'Python',            weight: 4, enabled: true },
  { id: '6fc2ee1b-e85c-45e1-a89c-986ef7ffeba5', name: 'Mode Analytics Blog',     url: 'https://mode.com/blog/rss.xml',                             category: 'Analytics',         weight: 3, enabled: true },
  { id: '59c08813-2ed2-40c4-9c99-ccd4c064c4ce', name: 'dbt Blog',                url: 'https://www.getdbt.com/blog/rss.xml',                       category: 'Data Engineering',  weight: 4, enabled: true },
  { id: 'b62716ea-014e-4227-9cfc-77b895ecdd87', name: 'Flowing Data',            url: 'https://flowingdata.com/feed',                              category: 'Visualisation',     weight: 3, enabled: true },
];
