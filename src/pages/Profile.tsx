import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BookOpen, Edit2, Upload } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata?.name || '',
      bio: user?.user_metadata?.bio || '',
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError('');
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setError('');
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          bio: data.bio
        }
      });

      if (updateError) throw updateError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name: data.name
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Error updating profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Upload className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {uploading ? 'Uploading...' : 'Click to upload new image'}
            </p>
          </div>

          {/* Profile Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                {...register('name')}
                error={errors.name?.message}
                disabled={!isEditing || isSubmitting}
              />

              <Input
                label="Bio"
                {...register('bio')}
                as="textarea"
                rows={4}
                placeholder="Tell us about yourself..."
                disabled={!isEditing || isSubmitting}
              />

              {isEditing && (
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full md:w-auto"
                >
                  Save Changes
                </Button>
              )}
            </form>

            {/* User Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary dark:text-primary-light" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Books Listed</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">12</p>
                  </div>
                </div>
              </div>
              {/* Add more stats as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}