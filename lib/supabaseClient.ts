import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzldxakzcwioybiqelfj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bGR4YWt6Y3dpb3liaXFlbGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzI1NDgsImV4cCI6MjA4NTEwODU0OH0.6yTKc-uZd-rsHufTPy7yGKnKOthNOy7DV566-hXSz0M';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (file: File, folder: string = 'uploads'): Promise<string | null> => {
  try {
    // 1. Create a local preview immediately to ensure UI responsiveness
    const localPreviewUrl = URL.createObjectURL(file);

    // Sanitize filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    // 2. Attempt Supabase Upload
    const { data, error } = await supabase.storage
      .from('MG photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    // 3. Handle RLS/Permission Errors gracefully
    if (error) {
      // Return local URL if upload fails due to policy (Offline/Demo mode)
      return localPreviewUrl;
    }

    // 4. If success, return public URL
    const { data: { publicUrl } } = supabase.storage
      .from('MG photos')
      .getPublicUrl(data.path);
      
    return publicUrl;
  } catch (err) {
    console.error('Upload exception:', err);
    // Fallback on crash
    return URL.createObjectURL(file);
  }
};