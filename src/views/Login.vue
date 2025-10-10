<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-center text-muted mb-4">
                                <h2>GWA Project</h2>
                                <small>Sign in with your credentials</small>
                            </div>

                            <!-- Alert Messages -->
                            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                                {{ errorMessage }}
                                <button type="button" class="close" @click="errorMessage = ''">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <form role="form" @submit.prevent="handleLogin">
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Email"
                                            v-model="email"
                                            type="email"
                                            required
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input alternative
                                            type="password"
                                            placeholder="Password"
                                            v-model="password"
                                            required
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <base-checkbox v-model="rememberMe">
                                    Remember me
                                </base-checkbox>
                                <div class="text-center">
                                    <base-button type="primary" class="my-4" native-type="submit" :disabled="loading">
                                        <span v-if="!loading">Sign In</span>
                                        <span v-else><i class="fa fa-spinner fa-spin"></i> Loading...</span>
                                    </base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div class="col-6">
                            <router-link to="/register" class="text-light">
                                <small>Create new account</small>
                            </router-link>
                        </div>
                        <div class="col-6 text-right">
                            <a href="/" class="text-light">
                                <small>← Back to Home</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import api from '../services/api';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            rememberMe: true,
            loading: false,
            errorMessage: ''
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.errorMessage = '';

            try {
                const response = await api.auth.login(this.email, this.password);

                if (response.success) {
                    // Show success message
                    this.$swal({
                        icon: 'success',
                        title: 'Login Successful!',
                        text: 'Redirecting to dashboard...',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    // Redirect to dashboard
                    setTimeout(() => {
                        this.$router.push('/dashboard');
                    }, 1500);
                } else {
                    this.errorMessage = response.message || 'Login failed. Please check your credentials.';
                }
            } catch (error) {
                console.error('Login error:', error);
                this.errorMessage = error.message || 'An error occurred during login. Please try again.';
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        // Check if already logged in
        const token = localStorage.getItem('gwa_access_token');
        if (token) {
            this.$router.push('/dashboard');
        }
    }
};
</script>

<style scoped>
.alert {
    border-radius: 0.375rem;
    margin-bottom: 1rem;
}
</style>
