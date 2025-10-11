<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <h3>GWA Project</h3>
        <button class="close-btn" @click="toggleSidebar">×</button>
      </div>

      <div class="sidebar-menu">
        <router-link to="/dashboard" class="menu-item" exact-active-class="active">
          <i class="ni ni-tv-2"></i>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/dashboard/profile" class="menu-item" active-class="active">
          <i class="ni ni-single-02"></i>
          <span>Profile</span>
        </router-link>

        <router-link v-if="isAdmin" to="/dashboard/users" class="menu-item" active-class="active">
          <i class="ni ni-bullet-list-67"></i>
          <span>Users</span>
        </router-link>

        <router-link to="/dashboard/qris" class="menu-item" active-class="active">
          <i class="ni ni-credit-card"></i>
          <span>QRIS Payment</span>
        </router-link>

        <router-link to="/dashboard/settings" class="menu-item" active-class="active">
          <i class="ni ni-settings-gear-65"></i>
          <span>Settings</span>
        </router-link>

        <a href="#" @click.prevent="handleLogout" class="menu-item logout">
          <i class="ni ni-user-run"></i>
          <span>Logout</span>
        </a>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Navbar -->
      <nav class="navbar">
        <button class="menu-toggle" @click="toggleSidebar">
          <i class="ni ni-align-left-2"></i>
        </button>

        <div class="navbar-right">
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <div class="user-avatar">{{ userInitial }}</div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div class="overlay" :class="{ 'show': sidebarOpen }" @click="toggleSidebar"></div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'DashboardLayout',
  data() {
    return {
      sidebarOpen: false,
      userName: 'User',
      userInitial: 'U',
      isAdmin: false
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
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
    loadUserData() {
      const user = JSON.parse(localStorage.getItem('gwa_user') || '{}');
      if (user.name) {
        this.userName = user.name;
        this.userInitial = user.name.charAt(0).toUpperCase();
      }
      // Check if user is admin
      this.isAdmin = user.role === 'admin';
    }
  },
  mounted() {
    this.loadUserData();

    // Check authentication
    const token = localStorage.getItem('gwa_access_token');
    if (!token) {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f7fafc;
}

.sidebar {
  width: 260px;
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  color: white;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.sidebar-menu {
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.menu-item i {
  font-size: 1.25rem;
  margin-right: 1rem;
  width: 20px;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-left: 3px solid white;
}

.menu-item.logout {
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
}

.navbar {
  background: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #525f7f;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-weight: 600;
  color: #32325d;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.content-wrapper {
  padding: 2rem;
  min-height: calc(100vh - 72px);
}

.overlay {
  display: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar .close-btn {
    display: block;
  }

  .main-content {
    margin-left: 0;
  }

  .menu-toggle {
    display: block;
  }

  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
  }

  .overlay.show {
    opacity: 1;
    visibility: visible;
  }

  .content-wrapper {
    padding: 1rem;
  }
}
</style>
