import { useState } from 'react';
import { checkAdminStatus } from '../utils/checkAdmin';
import { queryAdminStatus } from '../utils/checkAdminQuery';
import { Button } from '../../../components/ui/Button';

export function AdminTest() {
  const [singleUserStatus, setSingleUserStatus] = useState<any>(null);
  const [allAdmins, setAllAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkSingleUser = async () => {
    try {
      setLoading(true);
      setError('');
      const status = await checkAdminStatus('narh@gmail.com');
      setSingleUserStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error checking admin status');
    } finally {
      setLoading(false);
    }
  };

  const checkAllAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const admins = await queryAdminStatus();
      setAllAdmins(admins);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching admin users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Status Test
      </h2>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Check Single User
          </h3>
          <Button
            onClick={checkSingleUser}
            isLoading={loading}
          >
            Check narh@gmail.com Status
          </Button>

          {singleUserStatus && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                Is Admin: <span className="font-semibold">{singleUserStatus.isAdmin ? 'Yes' : 'No'}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Profile Role: <span className="font-semibold">{singleUserStatus.profileRole}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Metadata Role: <span className="font-semibold">{singleUserStatus.metadataRole}</span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            All Admin Users
          </h3>
          <Button
            onClick={checkAllAdmins}
            isLoading={loading}
          >
            Fetch All Admins
          </Button>

          {allAdmins.length > 0 && (
            <div className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Profile Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Metadata Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {allAdmins.map((admin, index) => (
                      <tr key={admin.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {admin.profileRole}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {admin.metadataRole}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}