import { apiSlice } from './apiSlice';
import { mockApiService } from '../../services/mockApi';

export interface BotConfig {
  id?: number;
  selectedCoin: string;
  percentage: number;
  stopLoss: number;
  takeProfit: number;
  profitFactor: number;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBotConfigRequest {
  selectedCoin: string;
  percentage: number;
  stopLoss: number;
  takeProfit: number;
  profitFactor: number;
}

export interface UpdateBotConfigRequest {
  id: number;
  selectedCoin?: string;
  percentage?: number;
  stopLoss?: number;
  takeProfit?: number;
  profitFactor?: number;
  isActive?: boolean;
}

export const botApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bot configurations
    getBotConfigs: builder.query<BotConfig[], void>({
      queryFn: async () => {
        try {
          const data = await mockApiService.getBotConfigs();
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Bot'],
    }),
    
    // Get active bot configuration
    getActiveBotConfig: builder.query<BotConfig, void>({
      queryFn: async () => {
        try {
          const data = await mockApiService.getActiveBotConfig();
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result) => result ? [{ type: 'Bot', id: result.id }] : ['Bot'],
    }),
    
    // Create new bot configuration
    createBotConfig: builder.mutation<BotConfig, CreateBotConfigRequest>({
      queryFn: async (newConfig) => {
        try {
          const data = await mockApiService.createBotConfig(newConfig);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Bot'],
    }),
    
    // Update bot configuration
    updateBotConfig: builder.mutation<BotConfig, UpdateBotConfigRequest>({
      queryFn: async ({ id, ...patch }) => {
        try {
          const data = await mockApiService.updateBotConfig(id, patch);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Bot', id }],
    }),
    
    // Delete bot configuration
    deleteBotConfig: builder.mutation<{ success: boolean; id: number }, number>({
      queryFn: async (id) => {
        try {
          const data = await mockApiService.deleteBotConfig(id);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Bot', id }],
    }),
    
    // Start/Stop bot
    toggleBot: builder.mutation<{ success: boolean; isActive: boolean }, { id: number; isActive: boolean }>({
      queryFn: async ({ id, isActive }) => {
        try {
          const data = await mockApiService.toggleBot(id, isActive);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Bot', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetBotConfigsQuery,
  useGetActiveBotConfigQuery,
  useCreateBotConfigMutation,
  useUpdateBotConfigMutation,
  useDeleteBotConfigMutation,
  useToggleBotMutation,
} = botApi;
