const api = "";

export const Task = {
  list: async () => {
    const r = await fetch(`${api}/api/tasks`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  create: async (data) => {
    const r = await fetch(`${api}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  update: async (id, data) => {
    const r = await fetch(`${api}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  delete: async (id) => {
    const r = await fetch(`${api}/api/tasks/${id}`, { method: "DELETE" });
    if (!r.ok && r.status !== 204) throw new Error(await r.text());
    return true;
  },
};

export const Label = {
  list: async () => {
    const r = await fetch(`${api}/api/labels`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  create: async (data) => {
    const r = await fetch(`${api}/api/labels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  delete: async (id) => {
    const r = await fetch(`${api}/api/labels?id=${id}`, { method: "DELETE" });
    if (!r.ok && r.status !== 204) throw new Error(await r.text());
    return true;
  },
};

export default { Task, Label };
