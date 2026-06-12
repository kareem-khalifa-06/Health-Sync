import { environment } from './../../../environments/environment.development';
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
 client: SupabaseClient = createClient(
 environment.supabaseUrl,
 environment.supabaseAnonKey
 );
}