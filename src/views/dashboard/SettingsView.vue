<template>
  <div class="settings-page">
    <div class="page-header">
      <h1><i class="ni ni-settings-gear-65"></i> Settings</h1>
      <p>Configure your preferences</p>
    </div>

    <div class="settings-card">
      <h3>Account Settings</h3>

      <div class="setting-item">
        <div class="setting-info">
          <strong>Change Password</strong>
          <p>Update your password to keep your account secure</p>
        </div>
        <button @click="showChangePassword" class="btn btn-outline">
          <i class="ni ni-lock-circle-open"></i> Change Password
        </button>
      </div>

      <hr />

      <div class="setting-item">
        <div class="setting-info">
          <strong>Email Notifications</strong>
          <p>Receive email notifications for important updates</p>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="settings.emailNotif" @change="saveSettings" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <strong>Discord Notifications</strong>
          <p>Receive notifications via Discord (requires Discord ID)</p>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="settings.discordNotif" @change="saveSettings" />
          <span class="slider"></span>
        </label>
      </div>

      <hr />

      <div class="setting-item">
        <div class="setting-info">
          <strong>Logout</strong>
          <p>Sign out from your account</p>
        </div>
        <button @click="handleLogout" class="btn btn-danger">
          <i class="ni ni-user-run"></i> Logout
        </button>
      </div>
    </div>

    <div class="settings-card">
      <h3>System Information</h3>

      <table class="info-table">
        <tbody>
          <tr>
            <td><strong>App Version</strong></td>
            <td>1.0.0</td>
          </tr>
          <tr>
            <td><strong>Backend Status</strong></td>
            <td><span class="badge badge-success">Online</span></td>
          </tr>
          <tr>
            <td><strong>Last Login</strong></td>
            <td>{{ lastLogin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'SettingsView',
  data() {
    return {
      settings: {
        emailNotif: true,
        discordNotif: false
      },
      lastLogin: new Date().toLocaleString()
    };
  },
  methods: {
    async showChangePassword() {
      const { value: formValues } = await this.$swal({
        title: 'Change Password',
        html:
          '<input id="swal-current" type="password" class="swal2-input" placeholder="Current Password">' +
          '<input id="swal-new" type="password" class="swal2-input" placeholder="New Password">' +
          '<input id="swal-confirm" type="password" class="swal2-input" placeholder="Confirm New Password">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Change Password',
        confirmButtonColor: '#5e72e4',
        preConfirm: () => {
          const current = document.getElementById('swal-current').value;
          const newPass = document.getElementById('swal-new').value;
          const confirm = document.getElementById('swal-confirm').value;

          if (!current || !newPass || !confirm) {
            this.$swal.showValidationMessage('Please fill all fields');
            return false;
          }

          if (newPass !== confirm) {
            this.$swal.showValidationMessage('New passwords do not match');
            return false;
          }

          if (newPass.length < 6) {
            this.$swal.showValidationMessage('Password must be at least 6 characters');
            return false;
          }

          return { current, newPass };
        }
      });

      if (formValues) {
        this.$swal({
          icon: 'info',
          title: 'Feature Coming Soon',
          text: 'Password change functionality will be available soon'
        });
      }
    },
    saveSettings() {
      // Save to localStorage
      localStorage.setItem('gwa_settings', JSON.stringify(this.settings));

      this.$swal({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your preferences have been updated',
        timer: 1500,
        showConfirmButton: false
      });
    },
    async handleLogout() {
      const result = await this.$swal({
        title: 'Logout?',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#5e72e4'
      });

      if (result.isConfirmed) {
        await api.auth.logout();
        this.$router.push('/login');
      }
    },
    loadSettings() {
      const saved = localStorage.getItem('gwa_settings');
      if (saved) {
        this.settings = JSON.parse(saved);
      }
    }
  },
  mounted() {
    this.loadSettings();
  }
};
</script>

<style scoped>
.settings-page {
  max-width: 800px;
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

.settings-card {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  margin-bottom: 1.5rem;
}

.settings-card h3 {
  margin: 0 0 1.5rem 0;
  color: #32325d;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.setting-info {
  flex: 1;
}

.setting-info strong {
  display: block;
  color: #32325d;
  margin-bottom: 0.25rem;
}

.setting-info p {
  color: #8898aa;
  font-size: 0.875rem;
  margin: 0;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 1rem 0;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline {
  background: white;
  border: 1px solid #5e72e4;
  color: #5e72e4;
}

.btn-outline:hover {
  background: #5e72e4;
  color: white;
}

.btn-danger {
  background: #f5365c;
  color: white;
}

.btn-danger:hover {
  background: #ec0c38;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #5e72e4;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  padding: 0.75rem;
  border-top: 1px solid #e9ecef;
}

.info-table tr:first-child td {
  border-top: none;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: #2dce89;
  color: white;
}
</style>
