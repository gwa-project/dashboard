<template>
  <div class="qris-page">
    <div class="page-header">
      <h1><i class="ni ni-credit-card"></i> QRIS Payment</h1>
      <p>Crowdfunding Payment System</p>
    </div>

    <!-- Queue Info -->
    <div v-if="queueInfo.isProcessing" class="alert alert-warning">
      <strong>⏰ Payment in Progress</strong>
      <p>Expires in: <strong>{{ queueTimer }}</strong></p>
      <p>Please wait until the payment is completed or expires.</p>
    </div>

    <!-- Payment Form -->
    <div v-if="!showPayment && !showStatus" class="payment-card">
      <h3>Create Payment</h3>

      <div class="form-group">
        <label>Amount (Rp)</label>
        <input
          type="number"
          class="form-control"
          v-model.number="amount"
          placeholder="Enter amount"
          min="1000"
        />
        <small class="text-muted">Minimum Rp 1,000</small>
      </div>

      <button
        @click="createOrder"
        class="btn btn-primary btn-block"
        :disabled="loading || queueInfo.isProcessing || amount < 1000"
      >
        <span v-if="!loading"><i class="ni ni-credit-card"></i> Create QRIS Payment</span>
        <span v-else><i class="fa fa-spinner fa-spin"></i> Processing...</span>
      </button>
    </div>

    <!-- QRIS Display -->
    <div v-if="showPayment" class="qris-card">
      <div class="order-info">
        <p><strong>Order ID:</strong> {{ orderId }}</p>
        <p><strong>Name:</strong> {{ customerName }}</p>
        <p><strong>Phone:</strong> {{ customerPhone }}</p>
        <p><strong>Amount:</strong> Rp {{ formatNumber(amount) }}</p>
      </div>

      <div class="qris-instructions">
        <p class="title">Scan QR Code Below</p>
        <p class="warning">⚠️ DO NOT LEAVE OR REFRESH THIS PAGE!</p>
      </div>

      <div class="countdown-timer">
        <i class="ni ni-time-alarm"></i>
        <span class="time">{{ countdown }}</span> seconds
      </div>

      <div class="qris-image-container">
        <img :src="qrisImage" alt="QRIS Code" class="qris-image" />
      </div>

      <div class="info-text">
        <i class="ni ni-info-circle"></i>
        Payment will automatically expire if not completed within the specified time
      </div>
    </div>

    <!-- Status Display -->
    <div v-if="showStatus" class="status-card">
      <div class="alert" :class="paymentStatus === 'success' ? 'alert-success' : 'alert-danger'">
        {{ statusMessage }}
      </div>
      <button @click="resetForm" class="btn btn-primary">
        <i class="ni ni-refresh"></i> Create New Payment
      </button>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'QRISPayment',
  data() {
    return {
      amount: null,
      orderId: null,
      qrisImage: '',
      customerName: '',
      customerPhone: '',
      loading: false,
      showPayment: false,
      showStatus: false,
      paymentStatus: '',
      statusMessage: '',
      countdown: 3600,
      queueInfo: {
        isProcessing: false,
        expiryTime: null
      },
      queueTimer: '00:00',
      countdownInterval: null,
      checkPaymentInterval: null,
      queueCheckInterval: null
    };
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('id-ID').format(num);
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },
    async checkQueue() {
      try {
        const response = await api.qris.checkQueueStatus();
        const data = response.data || response;

        if (data.success && data.isProcessing) {
          this.queueInfo.isProcessing = true;
          this.queueInfo.expiryTime = data.expiryTime;
          this.startQueueTimer();
        } else {
          this.queueInfo.isProcessing = false;
          if (this.queueCheckInterval) {
            clearInterval(this.queueCheckInterval);
          }
        }
      } catch (error) {
        console.error('Queue check error:', error);
      }
    },
    startQueueTimer() {
      if (this.queueCheckInterval) {
        clearInterval(this.queueCheckInterval);
      }

      this.queueCheckInterval = setInterval(() => {
        const now = new Date();
        const expiry = new Date(this.queueInfo.expiryTime);
        const timeLeft = Math.max(0, Math.floor((expiry - now) / 1000));

        if (timeLeft <= 0) {
          this.queueInfo.isProcessing = false;
          clearInterval(this.queueCheckInterval);
          this.checkQueue();
        } else {
          this.queueTimer = this.formatTime(timeLeft);
        }
      }, 1000);
    },
    async createOrder() {
      if (this.amount < 1000) {
        this.$swal({
          icon: 'error',
          title: 'Invalid Amount',
          text: 'Minimum amount is Rp 1,000'
        });
        return;
      }

      // Get user info
      const user = JSON.parse(localStorage.getItem('gwa_user') || '{}');
      if (!user.name || !user.phonenumber) {
        this.$swal({
          icon: 'warning',
          title: 'Incomplete Profile',
          text: 'Please complete your profile first'
        });
        return;
      }

      this.loading = true;

      try {
        const response = await api.qris.createOrder(this.amount);
        const data = response.data || response;

        if (data.success) {
          this.orderId = data.orderId;
          this.qrisImage = data.qrisImageUrl || data.QRISImageURL;
          this.customerName = user.name;
          this.customerPhone = user.phonenumber;
          this.showPayment = true;

          this.startCountdown();
          this.startPaymentCheck();
        } else if (data.queueStatus) {
          this.$swal({
            icon: 'warning',
            title: 'Payment in Progress',
            text: 'Please wait for the current payment to complete'
          });
          this.checkQueue();
        } else {
          throw new Error(data.message || 'Failed to create payment');
        }
      } catch (error) {
        console.error('Create order error:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to create payment'
        });
      } finally {
        this.loading = false;
      }
    },
    startCountdown() {
      this.countdown = 3600;
      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval);
          this.displayStatus('failed', 'Payment expired. Please try again.');
        }
      }, 1000);
    },
    startPaymentCheck() {
      this.checkPaymentInterval = setInterval(async () => {
        try {
          const response = await api.qris.checkPaymentStatus(this.orderId);
          const data = response.data || response;

          if (data.success) {
            if (data.status === 'success') {
              clearInterval(this.checkPaymentInterval);
              this.displayStatus('success', 'Payment successful! Thank you.');
            } else if (data.status === 'failed') {
              clearInterval(this.checkPaymentInterval);
              this.displayStatus('failed', 'Payment failed. Please try again.');
            }
          }
        } catch (error) {
          console.error('Payment check error:', error);
        }
      }, 3000);
    },
    displayStatus(status, message) {
      clearInterval(this.countdownInterval);
      clearInterval(this.checkPaymentInterval);

      this.showPayment = false;
      this.showStatus = true;
      this.paymentStatus = status;
      this.statusMessage = message;

      this.$swal({
        icon: status === 'success' ? 'success' : 'error',
        title: status === 'success' ? 'Success!' : 'Failed',
        text: message
      });
    },
    resetForm() {
      this.amount = null;
      this.orderId = null;
      this.qrisImage = '';
      this.showPayment = false;
      this.showStatus = false;
      this.paymentStatus = '';
      this.statusMessage = '';
      this.countdown = 3600;

      clearInterval(this.countdownInterval);
      clearInterval(this.checkPaymentInterval);

      this.checkQueue();
    }
  },
  mounted() {
    this.checkQueue();
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
    clearInterval(this.checkPaymentInterval);
    clearInterval(this.queueCheckInterval);
  }
};
</script>

<style scoped>
.qris-page {
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
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

.payment-card,
.qris-card,
.status-card {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
}

.payment-card h3 {
  margin: 0 0 1.5rem 0;
  color: #32325d;
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
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #5e72e4;
}

.text-muted {
  color: #8898aa;
  font-size: 0.8rem;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.alert-warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
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

.order-info {
  background: #f6f9fc;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.order-info p {
  margin: 0.5rem 0;
  color: #32325d;
}

.qris-instructions {
  text-align: center;
  margin-bottom: 1rem;
}

.qris-instructions .title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #32325d;
  margin-bottom: 0.5rem;
}

.qris-instructions .warning {
  color: #f5365c;
  font-weight: 600;
}

.countdown-timer {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5365c;
  margin: 1.5rem 0;
}

.countdown-timer i {
  font-size: 1.75rem;
}

.qris-image-container {
  text-align: center;
  margin: 2rem 0;
}

.qris-image {
  max-width: 100%;
  height: auto;
  border: 2px solid #5e72e4;
  border-radius: 0.5rem;
  padding: 1rem;
  background: white;
}

.info-text {
  text-align: center;
  background: #d1ecf1;
  color: #0c5460;
  padding: 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
</style>
