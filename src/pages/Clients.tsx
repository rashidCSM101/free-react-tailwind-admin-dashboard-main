import { useState } from "react";

interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  status: "Active" | "Pending" | "Inactive";
}

const initialClients: Client[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", company: "Acme Inc.", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", company: "Globex", status: "Pending" },
  { id: 3, name: "Carol Lee", email: "carol@example.com", company: "Initech", status: "Inactive" },
  { id: 4, name: "David Kim", email: "david@example.com", company: "Umbrella", status: "Active" },
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [newClient, setNewClient] = useState<Pick<Client, "name" | "email" | "company" | "status">>({
    name: "",
    email: "",
    company: "",
    status: "Active",
  });

  const addClient = () => {
    // Basic validation
    if (!newClient.name.trim() || !newClient.email.trim()) return;
    const nextId = clients.length ? Math.max(...clients.map((c) => c.id)) + 1 : 1;
    const client: Client = { id: nextId, ...newClient };
    setClients((prev) => [client, ...prev]);
    setNewClient({ name: "", email: "", company: "", status: "Active" });
  };

  const removeClient = (id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const statusBadge = (status: Client["status"]) => {
    const base = "px-2.5 py-1 rounded-full text-theme-xs font-medium";
    if (status === "Active") return <span className={`bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 ${base}`}>Active</span>;
    if (status === "Pending") return <span className={`bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 ${base}`}>Pending</span>;
    return <span className={`bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300 ${base}`}>Inactive</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clients</h2>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Manage your clients. This is a sample page you can extend with real data.</p>
      </div>

      {/* Add Client Form */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Name</label>
            <input
              type="text"
              value={newClient.name}
              onChange={(e) => setNewClient((s) => ({ ...s, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Client name"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient((s) => ({ ...s, email: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="email@example.com"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Company</label>
            <input
              type="text"
              value={newClient.company}
              onChange={(e) => setNewClient((s) => ({ ...s, company: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Company"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-theme-sm text-gray-700 dark:text-gray-200 mb-1">Status</label>
            <select
              value={newClient.status}
              onChange={(e) => setNewClient((s) => ({ ...s, status: e.target.value as Client["status"] }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
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
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-theme-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{client.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {statusBadge(client.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="mr-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5">View</button>
                    <button className="mr-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5">Edit</button>
                    <button
                      onClick={() => removeClient(client.id)}
                      className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-3 py-1.5"
                    >
                      Remove
                    </button>
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
