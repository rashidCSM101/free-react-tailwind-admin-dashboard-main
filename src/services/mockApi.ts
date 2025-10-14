// Mock API service for demonstration
// In a real app, this would be replaced with actual API endpoints

import { Client } from '../store/api/clientsApi';
import { BotConfig } from '../store/api/botApi';

// Mock data
let mockClients: Client[] = [
  {
    id: 1,
    full_name: "Eleanor Hayes",
    api_key: "a3b0d7e2f91c4a4b9e8f",
    api_token: "c2f65e2f94a7d91e7a83d4f21",
    created_at: "2023-06-12T10:14:23Z",
    updated_at: "2024-03-04T18:29:55Z",
  },
  {
    id: 2,
    full_name: "Marcus Turner",
    api_key: "f41b8e29c7d94c01b3e7",
    api_token: "a7e2b94c1d04f93b82c6e71a2",
    created_at: "2022-11-02T09:21:11Z",
    updated_at: "2023-12-17T20:47:33Z",
  },
];

let mockBotConfigs: BotConfig[] = [
  {
    id: 1,
    selectedCoin: "XRP",
    percentage: 10,
    stopLoss: 0.2,
    takeProfit: 0.2,
    profitFactor: 0.2,
    isActive: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApiService = {
  // Clients
  async getClients(): Promise<Client[]> {
    await delay(500);
    return [...mockClients];
  },

  async getClient(id: number): Promise<Client> {
    await delay(300);
    const client = mockClients.find(c => c.id === id);
    if (!client) throw new Error('Client not found');
    return client;
  },

  async createClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    await delay(800);
    const newClient: Client = {
      ...data,
      id: Math.max(...mockClients.map(c => c.id), 0) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockClients.push(newClient);
    return newClient;
  },

  async updateClient(id: number, data: Partial<Omit<Client, 'id' | 'created_at'>>): Promise<Client> {
    await delay(600);
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Client not found');
    
    mockClients[index] = {
      ...mockClients[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockClients[index];
  },

  async deleteClient(id: number): Promise<{ success: boolean; id: number }> {
    await delay(400);
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Client not found');
    
    mockClients.splice(index, 1);
    return { success: true, id };
  },

  // Bot Configs
  async getBotConfigs(): Promise<BotConfig[]> {
    await delay(400);
    return [...mockBotConfigs];
  },

  async getActiveBotConfig(): Promise<BotConfig> {
    await delay(300);
    const activeConfig = mockBotConfigs.find(c => c.isActive);
    if (!activeConfig) throw new Error('No active bot configuration');
    return activeConfig;
  },

  async createBotConfig(data: Omit<BotConfig, 'id' | 'created_at' | 'updated_at' | 'isActive'>): Promise<BotConfig> {
    await delay(700);
    const newConfig: BotConfig = {
      ...data,
      id: Math.max(...mockBotConfigs.map(c => c.id || 0), 0) + 1,
      isActive: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockBotConfigs.push(newConfig);
    return newConfig;
  },

  async updateBotConfig(id: number, data: Partial<Omit<BotConfig, 'id' | 'created_at'>>): Promise<BotConfig> {
    await delay(500);
    const index = mockBotConfigs.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Bot configuration not found');
    
    mockBotConfigs[index] = {
      ...mockBotConfigs[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return mockBotConfigs[index];
  },

  async deleteBotConfig(id: number): Promise<{ success: boolean; id: number }> {
    await delay(400);
    const index = mockBotConfigs.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Bot configuration not found');
    
    mockBotConfigs.splice(index, 1);
    return { success: true, id };
  },

  async toggleBot(id: number, isActive: boolean): Promise<{ success: boolean; isActive: boolean }> {
    await delay(600);
    const index = mockBotConfigs.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Bot configuration not found');
    
    // Deactivate all other bots if activating this one
    if (isActive) {
      mockBotConfigs.forEach(config => {
        if (config.id !== id) config.isActive = false;
      });
    }
    
    mockBotConfigs[index].isActive = isActive;
    mockBotConfigs[index].updated_at = new Date().toISOString();
    
    return { success: true, isActive };
  },
};
