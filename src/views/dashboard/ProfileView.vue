<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>Profile Management</h1>
      <p>Update your personal information</p>
    </div>

    <div class="profile-card">
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.name"
            required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            class="form-control"
            v-model="formData.email"
            readonly
          />
          <small class="text-muted">Email cannot be changed</small>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            class="form-control"
            v-model="formData.phonenumber"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div class="form-group">
          <label>Discord ID</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.discordid"
            placeholder="username#1234"
          />
        </div>

        <div class="form-group">
          <label>Role</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.role"
            readonly
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="!loading">Update Profile</span>
            <span v-else><i class="fa fa-spinner fa-spin"></i> Updating...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'ProfileView',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phonenumber: '',
        discordid: '',
        role: ''
      },
      loading: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async loadProfile() {
      const user = JSON.parse(localStorage.getItem('gwa_user') || '{}');
      this.formData.name = user.name || '';
      this.formData.email = user.email || '';
      this.formData.phonenumber = user.phonenumber || '';
      this.formData.discordid = user.discordid || '';
      this.formData.role = user.role || '';
    },
    async updateProfile() {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        const response = await api.user.updateProfile({
          name: this.formData.name,
          phonenumber: this.formData.phonenumber,
          discordid: this.formData.discordid
        });

        if (response.success) {
          // Update localStorage
          const user = JSON.parse(localStorage.getItem('gwa_user'));
          user.name = this.formData.name;
          user.phonenumber = this.formData.phonenumber;
          user.discordid = this.formData.discordid;
          localStorage.setItem('gwa_user', JSON.stringify(user));

          this.successMessage = 'Profile updated successfully!';

          this.$swal({
            icon: 'success',
            title: 'Success!',
            text: 'Profile updated successfully!',
            timer: 2000
          });
        } else {
          this.errorMessage = response.message || 'Failed to update profile';
        }
      } catch (error) {
        console.error('Update error:', error);
        this.errorMessage = error.message || 'An error occurred';
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.loadProfile();
  }
};
</script>

<style scoped>
.profile-page {
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

.profile-card {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #32325d;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-control:focus {
  outline: none;
  border-color: #5e72e4;
}

.form-control:read-only {
  background: #f7fafc;
}

.text-muted {
  color: #8898aa;
  font-size: 0.8rem;
}

.form-actions {
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
