import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './AdminActivityPage.module.css';

interface ActivityLog {
  id: string;
  created_at: string;
  user_id: string;
  user_email: string;
  user_name: string;
  action_type: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string;
  old_data?: any;
  new_data?: any;
  changes?: any;
}

const AdminActivityPage = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [tableFilter, setTableFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('activity_log_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activity_log' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setActivities(prev => [payload.new as ActivityLog, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      default: return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return styles.actionCreate;
      case 'update': return styles.actionUpdate;
      case 'delete': return styles.actionDelete;
      default: return '';
    }
  };

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'products': return '📦';
      case 'orders': return '🛒';
      case 'seller_verifications': return '✅';
      case 'users': return '👤';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('sv-SE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderChanges = (activity: ActivityLog) => {
    if (!activity.changes) return null;

    const changes = Object.entries(activity.changes)
      .filter(([_, value]) => value !== null)
      .map(([key, value]: [string, any]) => (
        <div key={key} className={styles.change}>
          <span className={styles.changeField}>{key}:</span>
          <span className={styles.changeOld}>{String(value.old)}</span>
          <span className={styles.changeArrow}>→</span>
          <span className={styles.changeNew}>{String(value.new)}</span>
        </div>
      ));

    return changes.length > 0 ? <div className={styles.changes}>{changes}</div> : null;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.action_type !== filter) return false;
    if (tableFilter !== 'all' && activity.table_name !== tableFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.panel}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Activity Log</h1>
              <p className={styles.subtitle}>Real-time tracking of all changes</p>
            </div>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              Live
            </div>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Action:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Table:</label>
              <select 
                value={tableFilter} 
                onChange={(e) => setTableFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">All Tables</option>
                <option value="products">Products</option>
                <option value="orders">Orders</option>
                <option value="seller_verifications">Verifications</option>
              </select>
            </div>
          </div>

          <div className={styles.stats}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{activities.length}</div>
              <div className={styles.statLabel}>Total Events</div>
            </Card>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>
                {activities.filter(a => a.action_type === 'create').length}
              </div>
              <div className={styles.statLabel}>Created</div>
            </Card>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>
                {activities.filter(a => a.action_type === 'update').length}
              </div>
              <div className={styles.statLabel}>Updated</div>
            </Card>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>
                {activities.filter(a => a.action_type === 'delete').length}
              </div>
              <div className={styles.statLabel}>Deleted</div>
            </Card>
          </div>

          <div className={styles.timeline}>
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className={styles.activityCard}>
                <div className={styles.activityHeader}>
                  <div className={styles.activityMeta}>
                    <span className={`${styles.actionBadge} ${getActionColor(activity.action_type)}`}>
                      {getActionIcon(activity.action_type)} {activity.action_type}
                    </span>
                    <span className={styles.tableBadge}>
                      {getTableIcon(activity.table_name)} {activity.table_name}
                    </span>
                  </div>
                  <span className={styles.timestamp}>{formatDate(activity.created_at)}</span>
                </div>

                <div className={styles.activityBody}>
                  <div className={styles.userInfo}>
                    <strong>{activity.user_name || 'Unknown User'}</strong>
                    <span className={styles.userEmail}>{activity.user_email}</span>
                  </div>

                  {activity.action_type === 'update' && renderChanges(activity)}

                  {activity.action_type === 'create' && activity.new_data && (
                    <div className={styles.dataPreview}>
                      <strong>Created:</strong> {activity.new_data.name || activity.new_data.id}
                    </div>
                  )}

                  {activity.action_type === 'delete' && activity.old_data && (
                    <div className={styles.dataPreview}>
                      <strong>Deleted:</strong> {activity.old_data.name || activity.old_data.id}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <Card className={styles.emptyState}>
              <p>No activities found</p>
            </Card>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default AdminActivityPage;
