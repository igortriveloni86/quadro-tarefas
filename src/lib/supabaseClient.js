import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const nowISOString = () => new Date().toISOString();

const db = {
  Task: {
    list: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    },
    create: async (data) => {
      const { data: task, error } = await supabase
        .from("tasks")
        .insert([
          {
            ...data,
            created_date: nowISOString(),
            updated_date: nowISOString(),
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return task;
    },
    update: async (id, data) => {
      const { data: task, error } = await supabase
        .from("tasks")
        .update({
          ...data,
          updated_date: nowISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return task;
    },
    delete: async (id) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
  },
  Label: {
    list: async () => {
      const { data, error } = await supabase
        .from("labels")
        .select("*")
        .order("created_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    create: async (data) => {
      const { data: label, error } = await supabase
        .from("labels")
        .insert([
          {
            ...data,
            created_date: nowISOString(),
            updated_date: nowISOString(),
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return label;
    },
    delete: async (id) => {
      const { error } = await supabase.from("labels").delete().eq("id", id);
      if (error) throw error;
    },
  },
};

export default db;
