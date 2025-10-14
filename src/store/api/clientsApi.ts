import { apiSlice } from './apiSlice';
import { mockApiService } from '../../services/mockApi';

export interface Client {
  id: number;
  full_name: string;
  api_key: string;
  api_token: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  full_name: string;
  api_key: string;
  api_token: string;
}

export interface UpdateClientRequest {
  id: number;
  full_name: string;
  api_key: string;
  api_token: string;
}

export const clientsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all clients
    getClients: builder.query<Client[], void>({
      queryFn: async () => {
        try {
          const data = await mockApiService.getClients();
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Client'],
    }),
    
    // Get client by ID
    getClient: builder.query<Client, number>({
      queryFn: async (id) => {
        try {
          const data = await mockApiService.getClient(id);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (_, __, id) => [{ type: 'Client', id }],
    }),
    
    // Create new client
    createClient: builder.mutation<Client, CreateClientRequest>({
      queryFn: async (newClient) => {
        try {
          const data = await mockApiService.createClient(newClient);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Client'],
    }),
    
    // Update client
    updateClient: builder.mutation<Client, UpdateClientRequest>({
      queryFn: async ({ id, ...patch }) => {
        try {
          const data = await mockApiService.updateClient(id, patch);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Client', id }],
    }),
    
    // Delete client
    deleteClient: builder.mutation<{ success: boolean; id: number }, number>({
      queryFn: async (id) => {
        try {
          const data = await mockApiService.deleteClient(id);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Client', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
