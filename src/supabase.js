import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tnwntrwjpbkbevlmhxvr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRud250cndqcGJrYmV2bG1oeHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTU4OTAsImV4cCI6MjA1OTQzMTg5MH0.h81YGU2XgWGYZKgk1NsM1zfN8Xiz4RRK_WbtRTaXBdQ'
export const supabase = createClient(supabaseUrl, supabaseKey)