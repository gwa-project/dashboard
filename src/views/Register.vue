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
                <div class="col-lg-6">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-center text-muted mb-4">
                                <h2>GWA Project</h2>
                                <small>Create your account</small>
                            </div>

                            <!-- Alert Messages -->
                            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                                {{ errorMessage }}
                                <button type="button" class="close" @click="errorMessage = ''">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                                {{ successMessage }}
                                <button type="button" class="close" @click="successMessage = ''">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <form role="form" @submit.prevent="handleRegister">
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Full Name"
                                            v-model="formData.name"
                                            required
                                            addon-left-icon="ni ni-hat-3">
                                </base-input>

                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Email"
                                            v-model="formData.email"
                                            type="email"
                                            required
                                            addon-left-icon="ni ni-email-83">
                                </base-input>

                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Phone Number (Optional)"
                                            v-model="formData.phonenumber"
                                            addon-left-icon="ni ni-mobile-button">
                                </base-input>

                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Discord ID (Optional)"
                                            v-model="formData.discordid"
                                            addon-left-icon="ni ni-chat-round">
                                </base-input>
                                <small class="text-muted d-block mb-3">Example: username#1234</small>

                                <base-input alternative
                                            type="password"
                                            placeholder="Password"
                                            v-model="formData.password"
                                            required
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>

                                <base-input alternative
                                            type="password"
                                            placeholder="Confirm Password"
                                            v-model="confirmPassword"
                                            required
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>

                                <div class="text-muted font-italic" v-if="formData.password">
                                    <small>Password strength:
                                        <span :class="passwordStrengthClass">{{ passwordStrength }}</span>
                                    </small>
                                </div>

                                <div class="text-center">
                                    <base-button type="primary" class="my-4" native-type="submit" :disabled="loading">
                                        <span v-if="!loading">Create Account</span>
                                        <span v-else><i class="fa fa-spinner fa-spin"></i> Creating...</span>
                                    </base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div class="col-6">
                            <router-link to="/login" class="text-light">
                                <small>Already have an account? Sign in</small>
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
    name: 'Register',
    data() {
        return {
            formData: {
                name: '',
                email: '',
                phonenumber: '',
                discordid: '',
                password: ''
            },
            confirmPassword: '',
            loading: false,
            errorMessage: '',
            successMessage: ''
        };
    },
    computed: {
        passwordStrength() {
            const password = this.formData.password;
            if (!password) return '';
            if (password.length < 6) return 'weak';
            if (password.length < 10) return 'medium';
            return 'strong';
        },
        passwordStrengthClass() {
            const strength = this.passwordStrength;
            if (strength === 'weak') return 'text-danger font-weight-700';
            if (strength === 'medium') return 'text-warning font-weight-700';
            if (strength === 'strong') return 'text-success font-weight-700';
            return '';
        }
    },
    methods: {
        async handleRegister() {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            // Validation
            if (this.formData.password.length < 6) {
                this.errorMessage = 'Password must be at least 6 characters long';
                this.loading = false;
                return;
            }

            if (this.formData.password !== this.confirmPassword) {
                this.errorMessage = 'Passwords do not match';
                this.loading = false;
                return;
            }

            try {
                const response = await api.auth.register(this.formData);

                if (response.success) {
                    this.successMessage = 'Registration successful! Redirecting to login...';

                    // Show success message with SweetAlert
                    this.$swal({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: 'Please login with your credentials',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 2000);
                } else {
                    this.errorMessage = response.message || 'Registration failed. Please try again.';
                }
            } catch (error) {
                console.error('Registration error:', error);
                this.errorMessage = error.message || 'An error occurred during registration. Please try again.';
            } finally {
                this.loading = false;
            }
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
