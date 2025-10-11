<template>
  <div class="users-page">
    <div class="page-header">
      <h1>Users Management</h1>
      <p>View and manage all users</p>
    </div>

    <div class="users-card">
      <div class="card-header">
        <h3>All Users</h3>
        <div class="header-actions">
          <button @click="getWebhookSecret" class="btn-webhook" :disabled="loadingSecret">
            <i class="ni ni-key-25"></i>
            {{ loadingSecret ? 'Loading...' : 'Get Webhook Secret Key' }}
          </button>
          <button @click="loadUsers" class="btn-refresh" :disabled="loading">
            <i class="ni ni-refresh" :class="{ 'spin': loading }"></i>
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="fa fa-spinner fa-spin fa-3x"></i>
        <p>Loading users...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p class="text-danger">{{ error }}</p>
        <button @click="loadUsers" class="btn btn-primary">Retry</button>
      </div>

      <div v-else class="table-responsive">
        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Discord ID</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.name || '-' }}</td>
              <td>{{ user.email || '-' }}</td>
              <td>{{ user.phonenumber || '-' }}</td>
              <td>{{ user.discordid || '-' }}</td>
              <td>
                <span class="badge" :class="user.role === 'admin' ? 'badge-danger' : 'badge-info'">
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'UsersView',
  data() {
    return {
      users: [],
      loading: false,
      loadingSecret: false,
      error: null
    };
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.user.getUsers();

        if (response.success && response.data) {
          this.users = response.data;
        } else {
          this.error = response.message || 'Failed to load users';
        }
      } catch (error) {
        console.error('Error loading users:', error);
        this.error = error.message || 'An error occurred while loading users';
      } finally {
        this.loading = false;
      }
    },
    async getWebhookSecret() {
      this.loadingSecret = true;

      try {
        const token = localStorage.getItem('gwa_access_token');
        const response = await fetch('https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/api/crowdfunding/webhook-secret', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Login': token,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.$swal({
            icon: 'success',
            title: 'Webhook Secret Key',
            html: `
              <div style="text-align: left; margin-top: 1rem;">
                <p><strong>Secret Key:</strong></p>
                <input type="text" value="${data.secretKey}" readonly
                       style="width: 100%; padding: 0.5rem; font-family: monospace; background: #f6f9fc; border: 1px solid #e9ecef; border-radius: 0.25rem; margin-bottom: 1rem;"
                       onclick="this.select()">
                <p style="font-size: 0.875rem; color: #8898aa; margin-bottom: 0.5rem;">
                  <strong>Description:</strong> ${data.description}
                </p>
                <p style="font-size: 0.875rem; color: #8898aa;">
                  Click the key to select and copy it for Macrodroid configuration.
                </p>
              </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Close'
          });
        } else {
          this.$swal({
            icon: 'error',
            title: 'Failed',
            text: data.error || 'Failed to get webhook secret key',
            timer: 3000
          });
        }
      } catch (error) {
        console.error('Error getting webhook secret:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching webhook secret',
          timer: 3000
        });
      } finally {
        this.loadingSecret = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.loadUsers();
  }
};
</script>

<style scoped>
.users-page {
  max-width: 1400px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #32325d;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #8898aa;
}

.users-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #32325d;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-webhook {
  background: linear-gradient(87deg, #11cdef 0, #1171ef 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
}

.btn-webhook:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.btn-webhook:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.btn-refresh {
  background: none;
  border: none;
  cursor: pointer;
  color: #5e72e4;
  font-size: 1.25rem;
  padding: 0.5rem;
}

.btn-refresh:hover {
  color: #324cdd;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state,
.error-state {
  padding: 3rem;
  text-align: center;
}

.loading-state i {
  color: #5e72e4;
  margin-bottom: 1rem;
}

.table-responsive {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f6f9fc;
}

.users-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #8898aa;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  color: #525f7f;
}

.users-table tbody tr:hover {
  background: #f6f9fc;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-danger {
  background: #f5365c;
  color: white;
}

.badge-info {
  background: #11cdef;
  color: white;
}

.text-center {
  text-align: center;
}

.text-danger {
  color: #f5365c;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  color: white;
}
</style>
