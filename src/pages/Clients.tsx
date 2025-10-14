import { useState } from "react";
import { 
  useGetClientsQuery, 
  useCreateClientMutation, 
  useUpdateClientMutation, 
  useDeleteClientMutation,
  type Client,
  type CreateClientRequest
} from "../store/api/clientsApi";

export default function Clients() {
  // RTK Query hooks
  const { data: clients = [], isLoading, error } = useGetClientsQuery();
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  // Local state for form management
  const [newClient, setNewClient] = useState<CreateClientRequest>({
    full_name: "",
    api_key: "",
    api_token: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Pick<Client, "full_name" | "api_key" | "api_token"> | null>(null);

  const addClient = async () => {
    // Basic validation
    if (!newClient.full_name.trim() || !newClient.api_key.trim() || !newClient.api_token.trim()) return;
    
    try {
      await createClient(newClient).unwrap();
      setNewClient({ full_name: "", api_key: "", api_token: "" });
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const removeClient = async (id: number) => {
    try {
      await deleteClient(id).unwrap();
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setEditDraft({
      full_name: client.full_name,
      api_key: client.api_key,
      api_token: client.api_token,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = async () => {
    if (editingId === null || !editDraft) return;
    
    try {
      await updateClient({
        id: editingId,
        full_name: editDraft.full_name,
        api_key: editDraft.api_key,
        api_token: editDraft.api_token,
      }).unwrap();
      setEditingId(null);
      setEditDraft(null);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-red-800">
          <h3 className="text-lg font-medium">Error loading clients</h3>
          <p className="mt-1 text-sm">
            {error && typeof error === 'object' && 'data' in error 
              ? String(error.data) 
              : 'An error occurred while fetching clients.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clients</h2>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Manage your clients with real-time data synchronization.</p>
      </div>

      {/* Add Client Form */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
            <input
              type="text"
              value={newClient.full_name}
              onChange={(e) => setNewClient((s) => ({ ...s, full_name: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Client name"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">API Key</label>
            <input
              type="text"
              value={newClient.api_key}
              onChange={(e) => setNewClient((s) => ({ ...s, api_key: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter API key"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">API Token</label>
            <input
              type="text"
              value={newClient.api_token}
              onChange={(e) => setNewClient((s) => ({ ...s, api_token: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter API token"
            />
          </div>
          <div className="md:col-span-1 flex md:justify-end">
            <button
              onClick={addClient}
              className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5"
            >
              Add Client
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-3 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                <th scope="col" className="px-3 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">API Token</th>
                <th scope="col" className="px-3 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created At</th>
                <th scope="col" className="px-3 py-3 text-right text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {editingId === client.id && editDraft ? (
                      <input
                        type="text"
                        value={editDraft.full_name}
                        onChange={(e) => setEditDraft((s) => (s ? { ...s, full_name: e.target.value } : s))}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={client.full_name}>{client.full_name}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {editingId === client.id && editDraft ? (
                      <input
                        type="text"
                        value={editDraft.api_key}
                        onChange={(e) => setEditDraft((s) => (s ? { ...s, api_key: e.target.value } : s))}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-mono truncate" title={client.api_key}>{client.api_key}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                    {editingId === client.id && editDraft ? (
                      <input
                        type="text"
                        value={editDraft.api_token}
                        onChange={(e) => setEditDraft((s) => (s ? { ...s, api_token: e.target.value } : s))}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-mono truncate" title={client.api_token}>{client.api_token}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(client.created_at)}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === client.id ? (
                        <>
                          <button
                            onClick={cancelEdit}
                            className="rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEdit}
                            className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-2.5 py-1 text-xs"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                          </button>
                          <button
                            onClick={() => startEdit(client)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                          </button>
                          <button
                            onClick={() => removeClient(client.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
