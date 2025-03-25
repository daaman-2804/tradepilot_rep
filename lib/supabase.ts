// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth functions
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

// Database functions
export async function getEmployees() {
  const { data, error } = await supabase.from("employees").select("*")
  return { data, error }
}

export async function getDepartments() {
  const { data, error } = await supabase.from("departments").select("*")
  return { data, error }
}

export async function getProjects() {
  const { data, error } = await supabase.from("projects").select("*")
  return { data, error }
}

export async function getClients() {
  const { data, error } = await supabase.from("clients").select("*")
  return { data, error }
}

export async function getInvoices() {
  const { data, error } = await supabase.from("invoices").select("*")
  return { data, error }
}

// Create functions
export async function createEmployee(employee: any) {
  const { data, error } = await supabase.from("employees").insert([employee])
  return { data, error }
}

export async function createDepartment(department: any) {
  const { data, error } = await supabase.from("departments").insert([department])
  return { data, error }
}

export async function createProject(project: any) {
  const { data, error } = await supabase.from("projects").insert([project])
  return { data, error }
}

export async function createClient(client: any) {
  const { data, error } = await supabase.from("clients").insert([client])
  return { data, error }
}

export async function createInvoice(invoice: any) {
  const { data, error } = await supabase.from("invoices").insert([invoice])
  return { data, error }
}

// Update functions
export async function updateEmployee(id: string, updates: any) {
  const { data, error } = await supabase.from("employees").update(updates).eq("id", id)
  return { data, error }
}

export async function updateDepartment(id: string, updates: any) {
  const { data, error } = await supabase.from("departments").update(updates).eq("id", id)
  return { data, error }
}

export async function updateProject(id: string, updates: any) {
  const { data, error } = await supabase.from("projects").update(updates).eq("id", id)
  return { data, error }
}

export async function updateClient(id: string, updates: any) {
  const { data, error } = await supabase.from("clients").update(updates).eq("id", id)
  return { data, error }
}

export async function updateInvoice(id: string, updates: any) {
  const { data, error } = await supabase.from("invoices").update(updates).eq("id", id)
  return { data, error }
}

// Delete functions
export async function deleteEmployee(id: string) {
  const { data, error } = await supabase.from("employees").delete().eq("id", id)
  return { data, error }
}

export async function deleteDepartment(id: string) {
  const { data, error } = await supabase.from("departments").delete().eq("id", id)
  return { data, error }
}

export async function deleteProject(id: string) {
  const { data, error } = await supabase.from("projects").delete().eq("id", id)
  return { data, error }
}

export async function deleteClient(id: string) {
  const { data, error } = await supabase.from("clients").delete().eq("id", id)
  return { data, error }
}

export async function deleteInvoice(id: string) {
  const { data, error } = await supabase.from("invoices").delete().eq("id", id)
  return { data, error }
}

