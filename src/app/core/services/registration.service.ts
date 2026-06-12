import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  supabase=inject(SupabaseService)
  constructor() { }
  async registerClinic(email: string, password: string, clinicName: string,
ownerName: string) {

 const { data: authData, error: authError } = await this.supabase.client.auth.signUp({
 email, password
 });
 if (authError) throw authError;

 const slug = clinicName.toLowerCase().replace(/\s+/g, '-');
 const { data: clinic, error: clinicError } = await this.supabase.client
 .from('clinics')
 .insert({ name: clinicName, slug })
 .select()
 .single();
 if (clinicError) throw clinicError;
 
 await this.supabase.client.from('users').insert({
 id: authData.user!.id,
 clinic_id: clinic.id,
 full_name: ownerName,
 role: 'admin'
 });
 return clinic;
}
}
