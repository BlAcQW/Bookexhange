import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Save } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: '',
    stripeSecretKey: '',
    emailNotifications: true,
    maintenanceMode: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: updateError } = await supabase
        .from('settings')
        .upsert([settings]);

      if (updateError) throw updateError;
      setSuccess('Settings updated successfully');
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Settings
      </h2>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Settings
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Stripe Payments
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow users to make payments using Stripe
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.stripeEnabled}
                onChange={(e) => setSettings({ ...settings, stripeEnabled: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.stripeEnabled ? 'bg-primary dark:bg-primary-light' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.stripeEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          <Input
            label="Stripe Public Key"
            value={settings.stripePublicKey}
            onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
            placeholder="pk_test_..."
          />

          <Input
            label="Stripe Secret Key"
            type="password"
            value={settings.stripeSecretKey}
            onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
            placeholder="sk_test_..."
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Settings
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Notifications
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send email notifications for important events
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-primary dark:bg-primary-light' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable maintenance mode to prevent user access
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-primary dark:bg-primary-light' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            className="inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}