import { 
  jobTitlesDataset, 
  industriesDataset, 
  sectorsDataset, 
  domainsDataset, 
  responsibilitiesDataset 
} from '../data/mockDatasets';

// This service acts as a layer between the UI and the raw dataset files.
// Once actual CSV/JSON files are provided, this service will be responsible
// for fetching, parsing, and indexing them for fast search.

export const simulateNetworkDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DataService {
  async searchJobTitles(query: string): Promise<string[]> {
    // await this.simulateNetworkDelay();
    if (!query) return jobTitlesDataset.slice(0, 50);
    const lowerQuery = query.toLowerCase();
    return jobTitlesDataset.filter(j => j.toLowerCase().includes(lowerQuery)).slice(0, 50);
  }

  async searchIndustries(query: string): Promise<string[]> {
    if (!query) return industriesDataset.slice(0, 50);
    const lowerQuery = query.toLowerCase();
    return industriesDataset.filter(j => j.toLowerCase().includes(lowerQuery)).slice(0, 50);
  }

  async searchSectors(query: string): Promise<string[]> {
    if (!query) return sectorsDataset.slice(0, 50);
    const lowerQuery = query.toLowerCase();
    return sectorsDataset.filter(j => j.toLowerCase().includes(lowerQuery)).slice(0, 50);
  }

  async searchDomains(query: string): Promise<string[]> {
    if (!query) return domainsDataset.slice(0, 50);
    const lowerQuery = query.toLowerCase();
    return domainsDataset.filter(j => j.toLowerCase().includes(lowerQuery)).slice(0, 50);
  }

  async searchResponsibilities(query: string): Promise<string[]> {
    if (!query) return responsibilitiesDataset.slice(0, 50);
    const lowerQuery = query.toLowerCase();
    return responsibilitiesDataset.filter(j => j.toLowerCase().includes(lowerQuery)).slice(0, 50);
  }
}

export const dataService = new DataService();
