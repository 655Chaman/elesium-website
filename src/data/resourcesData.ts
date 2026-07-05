export interface ResourceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  googleDriveLink: string;
  markdownFile: string;
}

export const resourcesData: ResourceItem[] = [
  {
    id: '1',
    title: 'Sample Automation Workflow',
    slug: 'sample-automation-workflow',
    description: 'A complete guide and script template for automating data extraction and processing tasks.',
    category: 'Automation',
    date: 'July 2026',
    readTime: '5 min read',
    googleDriveLink: 'https://drive.google.com/file/d/your-google-drive-id/view?usp=sharing', // Update this link when you upload your files
    markdownFile: '/resources/sample-resource.md',
  },
  {
    id: '2',
    title: 'Multi-Channel Inbound Tracker',
    slug: 'multi-channel-inbound-tracker',
    description: 'The ultimate pipeline management dashboard to bring absolute clarity to your lead flow across all social platforms.',
    category: 'Operations',
    date: 'July 2026',
    readTime: '6 min read',
    googleDriveLink: 'https://docs.google.com/spreadsheets/d/1-aLyIWilXpnhshXDA2krm98a0uSCdSt_jaC0xx3unDA/edit?usp=sharing',
    markdownFile: '/resources/multi-channel-tracker.md',
  }
];
