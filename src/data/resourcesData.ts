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
    title: 'Offer Creation Blueprint',
    slug: 'offer-creation-blueprint',
    description: 'The reverse-engineered framework to build a world-class, irresistible offer instead of racing to the bottom with competitors.',
    category: 'Strategy',
    date: 'July 2026',
    readTime: '8 min read',
    googleDriveLink: 'https://docs.google.com/document/d/1RZeCYMKegf17kA48ijPpzRF6LxD1TiFoHVJ6PRDjaH4/edit?usp=sharing',
    markdownFile: '/resources/offer-creation-blueprint.md',
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
