// src/app/core/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { toCamelCase } from '../../utils/case-converter';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }
  async execute<T>(query: PromiseLike<{ data: any; error: any }>): Promise<T> {
    const { data, error } = await query;
    if (error) throw error;
    return toCamelCase<T>(data);
  }

  get clinicId(): string {
    
    return environment.clinicId;
  }
}