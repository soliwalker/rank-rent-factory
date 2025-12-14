
export type Language = 'en' | 'it' | 'es' | 'fr' | 'de';

export interface KeywordMetric {
  keyword: string;
  avgMonthlySearches: number;
  competition: 'High' | 'Medium' | 'Low';
  cpcLow: number;
  cpcHigh: number;
}

export interface GmbAnalysis {
  primaryCategory: string;
  secondaryCategories: string[];
}

export interface AdGroup {
  name: string;
  targetKeywords: string[];
}

export interface AdCopy {
  headline1: string;
  headline2: string;
  description: string;
}

export interface ProfitProjection {
  estimatedAdSpend: number;
  targetSalePricePerLead: number;
  totalPotentialRevenue: number;
  netProfit: number;
  leadsCount: number;
}

export interface DomainStrategy {
  selectedDomain: string;
  domainType: string;
  alternatives: string[];
  rationale: string;
}

export interface AstroStackDetails {
  framework: string;
  styling: string;
  deployment: string;
  cms: string;
  templateRepo: string;
  rationale: string;
}

export interface QualifyingQuestion {
  question: string;
  options: string[];
  rationale: string;
}

export interface LeadFunnel {
  strategy: string;
  questions: QualifyingQuestion[];
}

export interface SiloPage {
  pageTitle: string;
  urlSlug: string;
  targetKeyword: string;
  contentFocus: string;
}

export interface WebsiteStructure {
  strategy: string;
  serviceSilos: SiloPage[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: 'typescript' | 'markdown' | 'json' | 'html' | 'css';
  description: string;
}

export interface GeoGridPoint {
  name: string;
  type: 'Neighborhood' | 'Suburb' | 'District';
  targetValue: 'High' | 'Medium' | 'Low';
}

export interface CompetitorAnalysis {
  name: string;
  weakness: string;
  contentGap: string[];
}

export interface BusinessPlan {
  location: string;
  niche: string;
  language: Language;
  executiveSummary: string;
  gmbAnalysis: GmbAnalysis;
  keywords: KeywordMetric[];
  domainStrategy: DomainStrategy;
  googleAdsPlan: {
    adGroups: AdGroup[];
    exampleAd: AdCopy;
  };
  profitProjection: ProfitProjection;
  astroStack: AstroStackDetails;
  leadFunnel: LeadFunnel;
  websiteStructure: WebsiteStructure;
  siteAssets: GeneratedFile[];
  geoGridStrategy: GeoGridPoint[];
  competitorAnalysis: CompetitorAnalysis[];
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AppState {
  step: 'input' | 'processing' | 'results';
  logs: LogEntry[];
  plan: BusinessPlan | null;
  error: string | null;
  language: Language;
}
