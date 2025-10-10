<template>
  <div class="dashboard-page">
    <!-- Welcome Header -->
    <div class="welcome-card">
      <div class="welcome-content">
        <div class="user-avatar-large">{{ userInitial }}</div>
        <div>
          <h1 class="welcome-title">Welcome back, {{ userName }}!</h1>
          <p class="welcome-subtitle">{{ userEmail }}</p>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-gradient-red">
          <i class="ni ni-active-40"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Users</span>
          <h2 class="stat-value">{{ stats.totalUsers }}</h2>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-gradient-orange">
          <i class="ni ni-chart-pie-35"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Active Sessions</span>
          <h2 class="stat-value">{{ stats.activeSessions }}</h2>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-gradient-green">
          <i class="ni ni-money-coins"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Revenue</span>
          <h2 class="stat-value">Rp {{ formatNumber(stats.revenue) }}</h2>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-gradient-info">
          <i class="ni ni-chart-bar-32"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Performance</span>
          <h2 class="stat-value">{{ stats.performance }}%</h2>
        </div>
      </div>
    </div>

    <!-- Content Row -->
    <div class="content-row">
      <!-- Recent Activity -->
      <div class="card activity-card">
        <div class="card-header">
          <h3>Recent Activity</h3>
        </div>
        <div class="card-body">
          <div class="activity-list">
            <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.iconClass">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <small class="activity-time">{{ activity.time }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card actions-card">
        <div class="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div class="card-body">
          <div class="quick-actions">
            <router-link to="/profile" class="action-btn">
              <i class="ni ni-single-02"></i>
              <span>Edit Profile</span>
            </router-link>

            <router-link to="/users" class="action-btn">
              <i class="ni ni-bullet-list-67"></i>
              <span>Manage Users</span>
            </router-link>

            <router-link to="/qris-payment" class="action-btn">
              <i class="ni ni-credit-card"></i>
              <span>QRIS Payment</span>
            </router-link>

            <router-link to="/settings" class="action-btn">
              <i class="ni ni-settings-gear-65"></i>
              <span>Settings</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'Dashboard',
  data() {
    return {
      userName: 'User',
      userEmail: '',
      userInitial: 'U',
      stats: {
        totalUsers: 0,
        activeSessions: 1,
        revenue: 0,
        performance: 99.9
      },
      recentActivities: [
        {
          icon: 'ni ni-check-bold',
          iconClass: 'bg-success',
          text: 'Login successful',
          time: 'Just now'
        },
        {
          icon: 'ni ni-single-02',
          iconClass: 'bg-info',
          text: 'Profile viewed',
          time: '2 minutes ago'
        },
        {
          icon: 'ni ni-settings-gear-65',
          iconClass: 'bg-warning',
          text: 'Settings updated',
          time: '1 hour ago'
        }
      ]
    };
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('id-ID').format(num);
    },
    async loadUserData() {
      try {
        const user = JSON.parse(localStorage.getItem('gwa_user') || '{}');
        if (user.name) {
          this.userName = user.name;
          this.userEmail = user.email || '';
          this.userInitial = user.name.charAt(0).toUpperCase();
        }

        // Try to fetch fresh profile data
        const response = await api.auth.getProfile();
        if (response.success && response.data) {
          localStorage.setItem('gwa_user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    async loadStats() {
      try {
        // Load users count
        const usersResponse = await api.user.getUsers();
        if (usersResponse.success && usersResponse.data) {
          this.stats.totalUsers = usersResponse.data.length;
        }

        // Load QRIS totals if available
        const qrisResponse = await api.qris.getTotals();
        if (qrisResponse && qrisResponse.totalQRISAmount) {
          this.stats.revenue = qrisResponse.totalQRISAmount;
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  },
  mounted() {
    this.loadUserData();
    this.loadStats();
  }
};
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-card {
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  color: #5e72e4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
}

.welcome-subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.bg-gradient-red {
  background: linear-gradient(87deg, #f5365c 0, #f56036 100%);
}

.bg-gradient-orange {
  background: linear-gradient(87deg, #fb6340 0, #fbb140 100%);
}

.bg-gradient-green {
  background: linear-gradient(87deg, #2dce89 0, #2dcecc 100%);
}

.bg-gradient-info {
  background: linear-gradient(87deg, #11cdef 0, #1171ef 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #8898aa;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #32325d;
  margin: 0;
}

.content-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #32325d;
}

.card-body {
  padding: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.bg-success {
  background: #2dce89;
}

.bg-info {
  background: #11cdef;
}

.bg-warning {
  background: #fb6340;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #32325d;
}

.activity-time {
  color: #8898aa;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #32325d;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #5e72e4;
  background: #f6f9fc;
  transform: translateY(-2px);
}

.action-btn i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #5e72e4;
}

.action-btn span {
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .content-row {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
