// src/app/core/services/supabase.service.ts
import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { toCamelCase } from '../../utils/case-converter';
import { AppStateService } from './app-state.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  client: SupabaseClient;
  appState=inject(AppStateService);
  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }
  async execute<T>(query: PromiseLike<{ data: any; error: any }>): Promise<T> {
    this.appState.startLoader.set(true);
    try {
      const { data, error } = await query;
      if (error) throw error;
      return toCamelCase<T>(data);
    } finally {
      this.appState.startLoader.set(false);
    }
  }

  get clinicId(): string {
    
    return environment.clinicId;
  }
}