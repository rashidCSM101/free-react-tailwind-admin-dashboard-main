import { useState } from "react";

interface Client {
  id: number;
  full_name: string;
  api_key: string;
  api_token: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

const initialClients: Client[] = [
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

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [newClient, setNewClient] = useState<Pick<Client, "full_name" | "api_key" | "api_token">>({
    full_name: "",
    api_key: "",
    api_token: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Pick<Client, "full_name" | "api_key" | "api_token"> | null>(null);

  const nowIso = () => new Date().toISOString();

  const addClient = () => {
    // Basic validation
    if (!newClient.full_name.trim() || !newClient.api_key.trim() || !newClient.api_token.trim()) return;
    const nextId = clients.length ? Math.max(...clients.map((c) => c.id)) + 1 : 1;
    const timestamp = nowIso();
    const client: Client = {
      id: nextId,
      full_name: newClient.full_name,
      api_key: newClient.api_key,
      api_token: newClient.api_token,
      created_at: timestamp,
      updated_at: timestamp,
    };
    setClients((prev) => [client, ...prev]);
    setNewClient({ full_name: "", api_key: "", api_token: "" });
  };

  const removeClient = (id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
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

  const saveEdit = () => {
    if (editingId === null || !editDraft) return;
    setClients((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? {
              ...c,
              full_name: editDraft.full_name,
              api_key: editDraft.api_key,
              api_token: editDraft.api_token,
              updated_at: nowIso(),
            }
          : c,
      ),
    );
    setEditingId(null);
    setEditDraft(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clients</h2>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Manage your clients. This is a sample page you can extend with real data.</p>
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
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">API Token</th>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th scope="col" className="px-6 py-3 text-right text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === client.id && editDraft ? (
                      <input
                        type="text"
                        value={editDraft.full_name}
                        onChange={(e) => setEditDraft((s) => (s ? { ...s, full_name: e.target.value } : s))}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{client.full_name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === client.id && editDraft ? (
                      <input
                        type="text"
                        value={editDraft.api_key}
                        onChange={(e) => setEditDraft((s) => (s ? { ...s, api_key: e.target.value } : s))}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-300">{client.api_key}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === client.id && editDraft ? (
                      <input
                        type="text"
                        value={editDraft.api_token}
                        onChange={(e) => setEditDraft((s) => (s ? { ...s, api_token: e.target.value } : s))}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[240px]" title={client.api_token}>{client.api_token}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(client.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(client.updated_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {editingId === client.id ? (
                      <>
                        <button
                          onClick={cancelEdit}
                          className="mr-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className="rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="mr-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5">View</button>
                        <button
                          onClick={() => startEdit(client)}
                          className="mr-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeClient(client.id)}
                          className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-3 py-1.5"
                        >
                          Remove
                        </button>
                      </>
                    )}
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
