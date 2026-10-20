import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly adminClient: SupabaseClient;
  private readonly supabaseUrl: string;
  private readonly supabaseServiceKey: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or service key is not defined');
    }

    this.supabaseUrl = supabaseUrl;
    this.supabaseServiceKey = supabaseServiceKey;
    this.adminClient = this.createClient();
  }

  private createClient(): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  async signInWithPassword(email: string, password: string) {
    const client = this.createClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  }

  async getUserById(userId: string) {
    const { data, error } =
      await this.adminClient.auth.admin.getUserById(userId);
    if (error) {
      throw new Error(`Failed to fetch Supabase user: ${error.message}`);
    }
    return data.user;
  }

  async createUser(email: string, password: string) {
    const { data, error } = await this.adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Supabase user creation failed: ${error.message}`);
    }

    return data.user;
  }

  async deleteUser(userId: string) {
    const { error } = await this.adminClient.auth.admin.deleteUser(userId);
    if (error) {
      throw new Error(`Failed to delete Supabase user: ${error.message}`);
    }
  }
}
