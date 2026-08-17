

<template>
  <div class="sms-page">

    <!-- HERO -->
    <section class="sms-hero">
      <div>
        <span class="sms-badge">
          Phena SMS Center
        </span>

        <h1>SMS Wallet & Messaging</h1>

        <p>
          Buy SMS credits, request sender IDs, send messages to parents,
          and track your school's communication history from one place.
        </p>
      </div>

      <div class="hero-balance-card">
        <span>Available SMS Credits</span>

        <strong>
          {{ smsWallet.balance.toLocaleString() }}
        </strong>

        <small>
          1 credit = 1 SMS segment
        </small>
      </div>
    </section>

    <!-- TOP SUMMARY -->
    <section class="summary-grid">

      <div class="summary-card sender-summary-card">
        <span>Sender ID</span>

        <strong>
          {{ senderId.activeSenderId || 'Not requested' }}
        </strong>

        <small>
          {{ senderId.status }}
        </small>

        <button
          v-if="senderId.id"
          class="delete-sender-btn"
          type="button"
          @click="openDeleteSenderModal"
        >
          Delete Sender ID
        </button>
      </div>

      <div class="summary-card wallet-summary-card">
  <span>Wallet Balance</span>

  <strong>
    GHS {{ walletBalance.toFixed(2) }}
  </strong>

  <small>Cash</small>

  <button
    class="load-wallet-btn"
    type="button"
    @click="openLoadWalletModal"
  >
    Load Wallet
  </button>
</div>

      <div class="summary-card">
        <span>Sms Remaining</span>

        <strong>{{ smsWallet.balance.toLocaleString() }}</strong>
        <small>SMS credits</small>
      </div>

      <div class="summary-card">
  <span>Estimated Rate</span>

  <strong>
    GHS {{ smsSellingPrice.toFixed(4) }}
  </strong>

  <small>per SMS segment</small>
</div>

    </section>

    <!-- MAIN GRID -->
    <section class="sms-layout">

      <!-- LEFT COLUMN -->
      <div class="left-column">

        <!-- BUY SMS BUNDLE -->
        <div class="sms-card">

          <div class="card-header">
            <div>
              <h2>Buy SMS Bundle</h2>
              <p>
                Choose a bundle and request top-up. Your account will be credited
                after payment confirmation.
              </p>
            </div>
          </div>

          <div class="bundle-grid">

            <button
              v-for="bundle in bundles"
              :key="bundle.amount"
              class="bundle-card"
              :class="{ selected: selectedBundle?.amount === bundle.amount }"
              @click="selectBundle(bundle)"
            >
              <span>GHS {{ bundle.amount }}</span>

              <strong>
                {{ bundle.credits.toLocaleString() }}
              </strong>

              <small>SMS credits</small>
            </button>

          </div>

          <div class="field">
  <label>Custom Amount</label>

  <input
    v-model.number="customAmount"
    type="number"
    min="10"
    max="100"
    step="1"
    placeholder="Enter amount from 10 to 100"
  >

  <small>
    Enter whole cedis only. Decimals like 10.50 are not allowed.
  </small>
</div>

<div
  v-if="customAmount"
  class="sms-units-preview"
>
  <span>SMS Units You Will Receive</span>

  <strong>
    {{ customSmsUnits.toLocaleString() }}
  </strong>

  <small>
    Calculated at GHS {{ smsSellingPrice.toFixed(4) }} per SMS unit
  </small>
</div>


          <button
  class="primary-btn"
  :disabled="!isValidSmsPurchaseAmount"
  @click="requestTopUp"
>
  Buy SMS Credits
</button>

        </div>

        <!-- SEND SMS -->
        <!-- <div class="sms-card">

          <div class="card-header">
            <div>
              <h2>Send SMS</h2>
              <p>
                Send announcements, fee reminders, attendance notices and
                general messages.
              </p>
            </div>
          </div>

          <div class="field">
            <label>Sender ID</label>

            <input
              v-model="smsForm.senderId"
              type="text"
              maxlength="11"
              placeholder="Example: PHENASCH"
            >

            <small>
              Sender ID must be approved before sending.
            </small>
          </div>

          <div class="field">
            <label>Recipient Group</label>

            <select v-model="smsForm.recipientGroup">
              <option value="">
                Select recipient group
              </option>

              <option value="all-parents">
                All Parents
              </option>

              <option value="class-parents">
                Parents by Class
              </option>

              <option value="fee-debtors">
                Fee Debtors
              </option>

              <option value="staff">
                Staff
              </option>
            </select>
          </div>

          <div
            v-if="smsForm.recipientGroup === 'class-parents'"
            class="field"
          >
            <label>Class</label>

            <select v-model="smsForm.className">
              <option value="">
                Select class
              </option>

              <option
                v-for="className in classOptions"
                :key="className"
                :value="className"
              >
                {{ className }}
              </option>
            </select>
          </div>

          <div class="field">
            <label>Message</label>

            <textarea
              v-model="smsForm.message"
              rows="5"
              placeholder="Type SMS message here..."
            />
          </div>

          <div class="estimate-box">
            <div>
              <span>Characters</span>
              <strong>{{ messageLength }}</strong>
            </div>

            <div>
              <span>Segments</span>
              <strong>{{ segmentCount }}</strong>
            </div>

            <div>
              <span>Recipients</span>
              <strong>{{ estimatedRecipients }}</strong>
            </div>

            <div>
              <span>Estimated Cost</span>
              <strong>{{ estimatedCost.toLocaleString() }}</strong>
            </div>
          </div>

          <button
            class="primary-btn"
            :disabled="!canSendSms"
            @click="sendSms"
          >
            Send SMS
          </button>

        </div> -->

      </div>

      <!-- RIGHT COLUMN -->
      <div class="right-column">

        <!-- SENDER ID REQUEST -->
        <div class="sms-card">

          <div class="card-header">
            <div>
              <h2>Sender ID Request</h2>
              <p>
                Request your preferred SMS sender name.
                Your request will be reviewed and approved within 24 hours.
.
              </p>
            </div>
          </div>

          <div class="sender-status">
  <span>Status</span>

  <strong :class="senderId.status.toLowerCase()">
    {{ senderId.status }}
  </strong>
</div>

<div
  v-if="senderId.activeSenderId"
  class="sender-status"
>
  <span>Current Sender ID</span>

  <strong>
    {{ senderId.activeSenderId }}
  </strong>
</div>
          <div class="field">
            <label>Preferred Sender ID</label>

            <input
              v-model="senderIdForm.senderId"
              type="text"
              maxlength="11"
              placeholder="Example: KOGSCHOOL"
              @input="formatSenderId"
            >

            <small>
              Maximum 11 characters. No spaces recommended.
            </small>
          </div>

          <!-- <div class="field">
            <label>Reason / Description</label>

            <textarea
              v-model="senderIdForm.reason"
              rows="4"
              placeholder="Example: Official sender ID for our school SMS alerts."
            />
          </div> -->

          <button
            class="secondary-btn"
            @click="submitSenderIdRequest"
          >
            Submit Sender ID Request
          </button>

        </div>

        <!-- PRICING INFO -->
        <!-- <div class="sms-card">

          <h2>Pricing Model</h2>

          <div class="pricing-list">

            <div>
              <span>Phena Selling Price</span>
              <strong>
                GHS {{ pricing.sellingPricePerSms.toFixed(3) }}
              </strong>
            </div>

            <div>
              <span>Provider Cost</span>
              <strong>
                GHS {{ pricing.providerCostPerSms.toFixed(3) }}
              </strong>
            </div>

            <div>
              <span>Credit Type</span>
              <strong>Non-expiry</strong>
            </div>

            <div>
              <span>Charge Rule</span>
              <strong>Per SMS segment</strong>
            </div>

          </div>

        </div> -->

      </div>

    </section>

    <!-- HISTORY -->
    <section class="sms-card">

      <div class="card-header">
        <div>
          <h2>Recent SMS Activity</h2>
          <p>
            Track recent top-ups, SMS campaigns and wallet deductions.
          </p>
        </div>
      </div>

      <div class="history-table">

        <div class="history-row history-head">
          <span>Date</span>
          <span>Type</span>
          <span>Description</span>
          <span>Credits</span>
          <span>Status</span>
        </div>

        <div
          v-for="item in smsHistory"
          :key="item.id"
          class="history-row"
        >
          <span>{{ item.date }}</span>
          <span>{{ item.type }}</span>
          <span>{{ item.description }}</span>
          <span>{{ item.credits }}</span>
          <span>
            <strong :class="item.status.toLowerCase()">
              {{ item.status }}
            </strong>
          </span>
        </div>

      </div>

    </section>

    <div
  v-if="deleteSenderModalVisible"
  class="modal-backdrop"
>
  <div class="delete-modal">

    <div class="delete-modal-icon">
      !
    </div>

    <h3>
      Delete Sender ID?
    </h3>

    <p>
      Are you sure you want to delete this sender ID request?
      You will need to submit a new sender ID request again.
    </p>

    <div class="delete-modal-details">
      <span>Sender ID</span>

      <strong>
        {{ senderId.activeSenderId }}
      </strong>
    </div>

    <div class="modal-actions">

      <button
        class="cancel-modal-btn"
        type="button"
        @click="closeDeleteSenderModal"
      >
        Cancel
      </button>

      <button
        class="confirm-delete-btn"
        type="button"
        :disabled="deleteSenderLoading"
        @click="confirmDeleteSenderId"
      >
        {{
          deleteSenderLoading
            ? 'Deleting...'
            : 'Yes, Delete'
        }}
      </button>

    </div>

  </div>
</div>


<div
  v-if="loadWalletModalVisible"
  class="modal-backdrop"
>
  <div class="wallet-modal">

    <div class="wallet-modal-icon">
      ₵
    </div>

    <h3>
      Load Wallet
    </h3>

    <p>
      Enter the amount you want to load into your SMS wallet.
      You can load from GHS 10.00 to GHS 100.00.
    </p>

    <div class="field">
      <label>Amount</label>

      <input
        v-model="walletAmount"
        type="number"
        min="10"
        max="100"
        step="0.01"
        placeholder="Example: 10.00"
      >

      <small>
        Minimum GHS 10.00. Maximum GHS 100.00.
      </small>
    </div>



    <!-- // preview
<div class="wallet-preview">
  <span>Amount to Pay</span>

  <strong>
    GHS {{ formattedWalletAmount }}
  </strong>
</div> -->


    <div class="modal-actions">

      <button
        class="cancel-modal-btn"
        type="button"
        :disabled="walletLoading"
        @click="closeLoadWalletModal"
      >
        Cancel
      </button>

      <button
        class="paystack-btn"
        type="button"
        :disabled="walletLoading"
        @click="payWithPaystack"
      >
        {{
          walletLoading
            ? 'Processing...'
            : 'Pay with Paystack'
        }}
      </button>

    </div>

  </div>
</div>

  </div>
</template>


<script setup>
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, reactive, ref } from 'vue'


const smsSellingPrice = ref(0.055)   // mine


const customSmsUnits = computed(() => {

  const amount =
    Number(customAmount.value)

  if (!amount || Number.isNaN(amount)) {
    return 0
  }

  return Math.floor(
    amount / smsSellingPrice.value
  )
})

import {
    createWalletTopUpTransaction,
    deleteSenderId,
    getAccountEmailByTenantCode,
    getClientSmsWallet,
    getLatestSenderId,
    purchaseSmsCredits,
    requestSenderId,
    verifyWalletTopUpPayment
} from '@/services/auth.js'

const toast = useToast()

const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  'pk_live_851550690ca2d39b76b6fadacf0a760db6adf652'


const deleteSenderModalVisible = ref(false)

const deleteSenderLoading = ref(false)

const smsWallet = reactive({
  balance: 0,
  totalPurchased: 0,
  totalUsed: 0,
})




const walletBalance = ref(0.00)

const loadWalletModalVisible = ref(false)

const walletAmount = ref('')

const walletLoading = ref(false)

const formattedWalletAmount = computed(() => {

  const amount =
    Number(walletAmount.value)

  if (!amount || Number.isNaN(amount)) {
    return '0.00'
  }

  return
amount.toFixed(2)
})



const openDeleteSenderModal = () => {

  if (!senderId.id) {

    showToast(
      'warn',
      'No Sender ID',
      'No sender ID request is available to delete.'
    )

    return
  }

  deleteSenderModalVisible.value = true
}


const openLoadWalletModal = () => {

  walletAmount.value = ''

  loadWalletModalVisible.value = true
}

const closeLoadWalletModal = () => {

  if (walletLoading.value) {
    return
  }

  loadWalletModalVisible.value
= false
}

const payWithPaystack = async () => {

  const amount =
    Number(walletAmount.value)

  if (!walletAmount.value || Number.isNaN(amount)) {

    showToast(
      'warn',
      'Validation',
      'Please enter an amount to load.'
    )

    return
  }

  if (amount < 10) {

    showToast(
      'warn',
      'Validation',
      'You cannot load less than GHS 10.00.'
    )

    return
  }

  if (amount > 100) {

    showToast(
      'warn',
      'Validation',
      'You cannot load more than GHS 100.00.'
    )

    return
  }

  const roundedAmount =
    Number(amount.toFixed(2))

  const tenantCode =
    localStorage.getItem('tenantCode') || ''

  if (!tenantCode) {

    showToast(
      'error',
      'Missing Tenant',
      'Tenant code not found.'
    )

    return
  }

  if (
    !window.PaystackPop ||
    typeof window.PaystackPop.setup !== 'function'
  ) {

    showToast(
      'error',
      'Payment Not Ready',
      'Payment service is still loading. Please try again.'
    )

    return
  }

  try {

    walletLoading.value = true

    const emailResponse =
      await getAccountEmailByTenantCode(
        tenantCode
      )

    const payerEmail =
      emailResponse.data?.email || ''

    if (!payerEmail) {

      showToast(
        'error',
        'Missing Email',
        'Unable to retrieve account email for payment.'
      )

      walletLoading.value = false

      return
    }

    const createResponse =
      await createWalletTopUpTransaction({
        tenantCode,
        amount: roundedAmount.toFixed(2),
        email: payerEmail,
      })

    const reference =
      createResponse.data?.reference

    if (!reference) {

      showToast(
        'error',
        'Transaction Error',
        'Unable to create payment reference.'
      )

      walletLoading.value = false

      return
    }

    const handler =
      window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: payerEmail,
        amount: Math.round(roundedAmount * 100),
        currency: 'GHS',
        ref: reference,

        callback: function (response) {
          verifyWalletPayment(
            response.reference,
            roundedAmount
          )
        },

        onClose: function () {
          walletLoading.value = false
        },
      })

    handler.openIframe()

  } catch (error) {

    console.error(
      'Failed to initialize wallet top-up:',
      error
    )

    showToast(
      'error',
      'Payment Error',
      error?.response?.data?.message ||
        'Unable to start wallet payment.'
    )

    walletLoading.value = false
  }
}

const verifyWalletPayment = async (
  reference,
  paidAmount
) => {

  const tenantCode =
    localStorage.getItem('tenantCode') || ''

  if (!tenantCode) {

    showToast(
      'error',
      'Missing Tenant',
      'Tenant code not found.'
    )

    walletLoading.value = false

    return
  }

  try {

    const response =
      await verifyWalletTopUpPayment({
        tenantCode,
        reference,
      })


    if (response.data?.success) {

      await loadClientSmsWallet()

      smsHistory.value.unshift({
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        type: 'Wallet',
        description: `Wallet loaded with GHS ${Number(paidAmount).toFixed(2)}`,
        credits: '-',
        status: 'Completed',
      })

      showToast(
        'success',
        'Payment Successful',
        'Wallet loaded successfully.'
      )

      walletAmount.value = ''
      loadWalletModalVisible.value = false

    } else {

      showToast(
        'error',
        'Verification Failed',
        response.data?.message ||
          'Payment verification failed.'
      )
    }

  } catch (error) {

    console.error(
      'Wallet verification failed:',
      error
    )

    showToast(
      'error',
      'Verification Error',
      error?.response?.data?.message ||
        'Unable to verify payment.'
    )

  } finally {

    walletLoading.value = false
  }
}


const loadPaystackScript = () => {

  if (document.getElementById('paystack-script')) {
    return
  }

  const script =
    document.createElement('script')

  script.id =
    'paystack-script'

  script.src =
    'https://js.paystack.co/v1/inline.js'

  script.async =
    true

  document.body.appendChild(
    script
  )
}


const closeDeleteSenderModal = () => {

  if (deleteSenderLoading.value) {
    return
  }

  deleteSenderModalVisible.value = false
}


const confirmDeleteSenderId = async () => {

  const tenantCode =
    localStorage.getItem('tenantCode') || ''

  if (!tenantCode) {

    showToast(
      'error',
      'Missing Tenant',
      'Tenant code not found.'
    )

    return
  }

  if (!senderId.id) {

    showToast(
      'warn',
      'No Sender ID',
      'No sender ID request is available to delete.'
    )

    return
  }

  try {

    deleteSenderLoading.value = true

    await deleteSenderId(
      tenantCode,
      senderId.id
    )

    senderId.id = null
    senderId.activeSenderId = ''
    senderId.status = 'Not requested'
    senderId.reason = ''
    senderId.rejectionReason = ''
    senderId.available = false

    smsForm.senderId = ''

    smsHistory.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: 'Sender ID',
      description: 'Sender ID request deleted',
      credits: '-',
      status: 'Completed',
    })

    showToast(
      'success',
      'Deleted',
      'Sender ID request deleted successfully.'
    )

    deleteSenderModalVisible.value = false

    await loadLatestSenderId()

  } catch (error) {

    console.error(
      'Failed to delete sender ID:',
      error
    )

    showToast(
      'error',
      'Delete Failed',
      error?.response?.data?.message ||
        'Unable to delete sender ID request.'
    )

  } finally {

    deleteSenderLoading.value = false
  }
}


const loadLatestSenderId = async () => {

  try {

    const tenantCode =
      localStorage.getItem('tenantCode') || ''

    if (!tenantCode) {

      showToast(
        'warn',
        'Missing Tenant',
        'Tenant code not found.'
      )

      return
    }

    const response =
      await getLatestSenderId(
        tenantCode
      )



    const data =
      response.data

    if (!data.available || !data.senderId) {

      senderId.id = null
      senderId.activeSenderId = ''
      senderId.status = 'Not requested'
      senderId.reason = ''
      senderId.rejectionReason = ''
      senderId.available = false

      return
    }

    senderId.id =
      data.senderId.id

    senderId.activeSenderId =
      data.senderId.senderId || ''

    senderId.status =
      data.senderId.status || 'Pending'

    senderId.reason =
      data.senderId.reason || ''

    senderId.rejectionReason =
      data.senderId.rejectionReason || ''

    senderId.available = true

    smsForm.senderId =
      data.senderId.status === 'approved'
        ? data.senderId.senderId
        : ''

  } catch (error) {

    console.error(
      'Failed to load latest sender ID:',
      error
    )

    senderId.id = null
    senderId.activeSenderId = ''
    senderId.status = 'Not requested'
    senderId.available = false
  }
}

const senderId = reactive({
  id: null,
  activeSenderId: '',
  status: 'Not requested',
  reason: '',
  rejectionReason: '',
  available: false,
})

const isValidSmsPurchaseAmount = computed(() => {

  const amount =
    Number(customAmount.value)

  if (!amount || Number.isNaN(amount)) {
    return false
  }

  if (!Number.isInteger(amount)) {
    return false
  }

  if (amount < 10) {
    return false
  }

  if (amount > 100) {
    return false
  }

  return true
})

const selectBundle = (bundle) => {

  selectedBundle.value =
    bundle

  customAmount.value =
    bundle.amount
}

const selectedBundle = ref(null)

const customAmount = ref(null)



const bundleAmounts = [
  10,
  20,
  50,
  100,
]

const bundles = computed(() => {

  return bundleAmounts.map((amount) => {
    return {
      amount,
      credits: Math.floor(
        amount / smsSellingPrice.value
      ),
    }
  })
})

const senderIdForm = reactive({
  senderId: '',
  reason: '',
})

const smsForm = reactive({
  senderId: '',
  recipientGroup: '',
  className: '',
  message: '',
})

const classOptions = [
  'class 1',
  'class 2',
  'class 3',
  'class 4',
  'class 5',
  'class 6',
]

const smsHistory = ref([
  {
    id: 1,
    date: '2026-08-15',
    type: 'Top-up',
    description: 'Initial SMS credit purchase',
    credits: '+285',
    status: 'Completed',
  },
  {
    id: 2,
    date: '2026-08-15',
    type: 'Sender ID',
    description: 'Sender ID request submitted',
    credits: '-',
    status: 'Pending',
  },
])

const messageLength = computed(() => {
  return smsForm.message.length
})

const segmentCount = computed(() => {
  if (messageLength.value === 0) {
    return 0
  }

  return Math.ceil(
    messageLength.value / 160
  )
})

const estimatedRecipients = computed(() => {
  if (!smsForm.recipientGroup) {
    return 0
  }

  if (smsForm.recipientGroup === 'all-parents') {
    return 420
  }

  if (smsForm.recipientGroup === 'class-parents') {
    return smsForm.className ? 45 : 0
  }

  if (smsForm.recipientGroup === 'fee-debtors') {
    return 80
  }

  if (smsForm.recipientGroup === 'staff') {
    return 25
  }

  return 0
})

const estimatedCost = computed(() => {
  return segmentCount.value *
    estimatedRecipients.value
})

const canSendSms = computed(() => {
  return smsForm.senderId.trim().length > 0 &&
    smsForm.recipientGroup &&
    smsForm.message.trim().length > 0 &&
    estimatedCost.value > 0 &&
    smsWallet.balance >= estimatedCost.value
})

function showToast(
  severity,
  summary,
  detail
) {
  toast.add({
    severity,
    summary,
    detail,
    life: 4000,
  })
}

const loadClientSmsWallet = async () => {

  const tenantCode =
    localStorage.getItem('tenantCode') || ''

  if (!tenantCode) {

    showToast(
      'warn',
      'Missing Tenant',
      'Tenant code not found.'
    )

    return
  }

  try {

    const response =
      await getClientSmsWallet(
        tenantCode
      )



    walletBalance.value =
      Number(response.data?.cashBalance || 0)

    smsWallet.balance =
      Number(response.data?.smsBalance || 0)

  } catch (error) {

    console.error(
      'Failed to load client SMS wallet:',
      error
    )

    showToast(
      'error',
      'Wallet Error',
      error?.response?.data?.message ||
        'Unable to load wallet balance.'
    )
  }
}

onMounted(async () => {

  loadPaystackScript()

  await loadLatestSenderId()

  await loadClientSmsWallet()

})


function formatSenderId() {

  senderIdForm.senderId =
    senderIdForm.senderId
      .replace(/\s+/g, '')

      .slice(0, 11)
}



const submitSenderIdRequest = async () => {

  const tenantCode =
    localStorage.getItem('tenantCode') || ''

  const schoolName =
    localStorage.getItem('schoolName') || ''

  const sender =
    senderIdForm.senderId
      .trim()
      .replace(/\s+/g, '')

      .slice(0, 11)

  const reason =
    senderIdForm.reason.trim()

  if (!tenantCode) {

    showToast(
      'error',
      'Missing Tenant',
      'Tenant code not found.'
    )

    return
  }

  if (!sender) {

    showToast(
      'warn',
      'Validation',
      'Please enter a sender ID.'
    )

    return
  }

  try {

    const payload = {
      tenantCode,
      schoolName,
      senderId: sender,
      reason: reason || null,
    }

    const response =
  await requestSenderId(
    tenantCode,
    payload
  )




    senderId.id =
      response.data.id

    senderId.activeSenderId =
      response.data.senderId

    senderId.status =
      response.data.status || 'Pending'

    senderId.reason =
      response.data.reason || ''

    senderId.rejectionReason =
      response.data.rejectionReason || ''

    senderId.available =
      true

    smsHistory.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: 'Sender ID',
      description: `Sender ID request submitted: ${sender}`,
      credits: '-',
      status: 'Pending',
    })

    showToast(
      'success',
      'Request Sent',
      'Sender ID request submitted successfully.'
    )

    senderIdForm.senderId = ''
    senderIdForm.reason = ''



  } catch (error) {




    showToast(
      'error',
      'Sender ID Request Failed',
      error?.response?.data?.message ||
        'Unable to request sender ID.'
  )
  }
}


const requestTopUp = async () => {

  const tenantCode =
    localStorage.getItem('tenantCode') || ''

  const amount =
    Number(customAmount.value)

  if (!tenantCode) {

    showToast(
      'error',
      'Missing Tenant',
      'Tenant code not found.'
    )

    return
  }

  if (!amount || Number.isNaN(amount)) {

    showToast(
      'warn',
      'Validation',
      'Please select or enter an amount.'
    )

    return
  }

  if (!Number.isInteger(amount)) {

    showToast(
      'warn',
      'Validation',
      'Decimals are not allowed. Please enter a whole cedi amount.'
    )

    return
  }

  if (amount < 10) {

    showToast(
      'warn',
      'Validation',
      'You cannot buy less than GHS 10.00 worth of SMS.'
    )

    return
  }

  if (amount > 100) {

    showToast(
      'warn',
      'Validation',
      'You cannot buy more than GHS 100.00 worth of SMS at once.'
    )

    return
  }

  const credits =
    Math.floor(
      amount / smsSellingPrice.value
    )

  if (credits <= 0) {

    showToast(
      'warn',
      'Validation',
      'SMS credits could not be calculated.'
    )

    return
  }

  try {

    const response =
      await purchaseSmsCredits({
        tenantCode,
        amount: amount.toFixed(2),
        smsCredits: credits,
      })

    if (!response.data?.success) {

      showToast(
        'error',
        'SMS Purchase Failed',
        response.data?.message ||
          'Unable to purchase SMS credits.'
      )

      return
    }

    walletBalance.value =
      Number(response.data.cashBalance || 0)

    smsWallet.balance =
      Number(response.data.smsBalance || 0)

    smsWallet.totalPurchased =
      Number(response.data.totalSmsPurchased || 0)

    smsHistory.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: 'SMS Purchase',
      description: `Purchased ${response.data.smsCreditsPurchased.toLocaleString()} SMS units for GHS ${Number(response.data.amountSpent).toFixed(2)}`,
      credits: `+${response.data.smsCreditsPurchased.toLocaleString()}`,
      status: 'Completed',
    })

    showToast(
      'success',
      'SMS Purchased',
      `${response.data.smsCreditsPurchased.toLocaleString()} SMS units added successfully.`
    )

    selectedBundle.value = null
    customAmount.value = null

    await loadClientSmsWallet()

  } catch (error) {

    console.error(
      'Failed to purchase SMS credits:',
      error
    )

    showToast(
      'error',
      'SMS Purchase Failed',
      error?.response?.data?.message ||
        'Unable to purchase SMS credits.'
    )
  }
}


function sendSms() {
  if (!canSendSms.value) {
    showToast(
      'warn',
      'Validation',
      'Please complete the SMS form and ensure you have enough credits.'
    )

    return
  }

  smsWallet.balance -= estimatedCost.value
  smsWallet.totalUsed += estimatedCost.value

  smsHistory.value.unshift({
    id: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    type: 'Campaign',
    description: `${smsForm.recipientGroup} SMS campaign`,
    credits: `-${estimatedCost.value}`,
    status: 'Sent',
  })

  showToast(
    'success',
    'SMS Sent',
    'SMS campaign sent successfully.'
  )

  smsForm.message = ''
  smsForm.recipientGroup = ''
  smsForm.className = ''
}
</script>



<style scoped>
.sms-page {
  display: grid;
  gap: 24px;
}


.sms-units-preview {
  display: grid;
  gap: 6px;
  margin: 12px 0 18px;
  padding: 16px;
  border-radius: 16px;
  background: #fff7df;
  border: 1px solid rgba(201, 150, 53, 0.28);
}

.sms-units-preview span {
  color: #92400e;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sms-units-preview strong {
  color: #071926;
  font-size: 28px;
  font-weight: 950;
}

.sms-units-preview small {
  color: #64748b;
}

.wallet-summary-card {
  position: relative;
}

.load-wallet-btn {
  margin-top: 14px;
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 12px;
  color: #071926;
  background: #f5d58c;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.25s ease;
}

.load-wallet-btn:hover {
  background: #c99635;
  transform: translateY(-1px);
}

/* =========================
   LOAD WALLET MODAL
========================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
}

.wallet-modal {
  width: min(440px, 100%);
  padding: 28px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow:
    0 30px 90px rgba(15, 23, 42, 0.28);
  text-align: center;
}

.wallet-modal-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #071926;
  background: #f5d58c;
  font-size: 28px;
  font-weight: 950;
}

.wallet-modal h3 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 950;
}

.wallet-modal p {
  margin: 12px 0 18px;
  color: #64748b;
  line-height: 1.6;
}

.wallet-preview {
  display: grid;
  gap: 6px;
  margin-bottom: 22px;
  padding: 16px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.wallet-preview span {
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.wallet-preview strong {
  color: #111827;
  font-size: 23px;
  font-weight: 950;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cancel-modal-btn,
.paystack-btn {
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.25s ease;
}

.cancel-modal-btn {
  color: #374151;
  background: #f3f4f6;
}

.cancel-modal-btn:hover {
  background: #e5e7eb;
}

.paystack-btn {
  color: #071926;
  background:
    linear-gradient(
      135deg,
      #f5d58c,
      #c99635
    );
}

.paystack-btn:hover {
  transform: translateY(-1px);
}

.cancel-modal-btn:disabled,
.paystack-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 520px) {
  .modal-actions {
    grid-template-columns: 1fr;
  }
}

/* =========================
   HERO
========================= */

.sms-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 34px;
  border-radius: 30px;
  color: #ffffff;
  background:
    radial-gradient(
      circle at top left,
      rgba(245, 213, 140, 0.26),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #071926,
      #0f2742
    );
  box-shadow:
    0 24px 70px rgba(15, 23, 42, 0.18);
}

.sms-badge {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #f5d58c;
  color: #071926;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sms-hero h1 {
  margin: 0;
  color: papayawhip;
  font-size: 39px;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.sms-hero p {
  max-width: 680px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
}

.hero-balance-card {
  min-width: 240px;
  align-self: stretch;
  display: grid;
  align-content: center;
  gap: 8px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.hero-balance-card span,
.hero-balance-card small {
  color: rgba(255, 255, 255, 0.76);
}

.hero-balance-card strong {
  color: #f5d58c;
  font-size: 40px;
  font-weight: 950;
}

/* =========================
   SUMMARY CARDS
========================= */

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.summary-card {
  padding: 22px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow:
    0 14px 40px rgba(15, 23, 42, 0.07);
}

.summary-card span {
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-card strong {
  display: block;
  margin-top: 8px;
  color: #111827;
  font-size: 26px;
  font-weight: 950;
}

.summary-card small {
  color: #64748b;
}

/* =========================
   MAIN LAYOUT
========================= */

.sms-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.55fr);
  gap: 24px;
}

.left-column,
.right-column {
  display: grid;
  gap: 24px;
  align-content: start;
}

.sms-card {
  padding: 26px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow:
    0 16px 50px rgba(15, 23, 42, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.card-header h2,
.sms-card h2 {
  margin: 0;
  color: #111827;
  font-size: 21px;
  font-weight: 950;
}

.card-header p {
  margin: 7px 0 0;
  color: #64748b;
  line-height: 1.6;
}

/* =========================
   BUNDLE CARDS
========================= */

.bundle-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.bundle-card {
  padding: 18px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #f9fafb;
  text-align: left;
  cursor: pointer;
  transition: 0.25s ease;
}

.sender-summary-card {
  position: relative;
}

.delete-sender-btn {
  margin-top: 14px;
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 12px;
  color: #991b1b;
  background: #fee2e2;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.25s ease;
}

.delete-sender-btn:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

/* =========================
   DELETE MODAL
========================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
}

.delete-modal {
  width: min(420px, 100%);
  padding: 28px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow:
    0 30px 90px rgba(15, 23, 42, 0.28);
  text-align: center;
}

.delete-modal-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #991b1b;
  background: #fee2e2;
  font-size: 26px;
  font-weight: 950;
}

.delete-modal h3 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 950;
}

.delete-modal p {
  margin: 12px 0 18px;
  color: #64748b;
  line-height: 1.6;
}

.delete-modal-details {
  display: grid;
  gap: 6px;
  margin-bottom: 22px;
  padding: 14px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.delete-modal-details span {
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.delete-modal-details strong {
  color: #111827;
  font-size: 18px;
  font-weight: 950;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cancel-modal-btn,
.confirm-delete-btn {
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.25s ease;
}

.cancel-modal-btn {
  color: #374151;
  background: #f3f4f6;
}

.cancel-modal-btn:hover {
  background: #e5e7eb;
}

.confirm-delete-btn {
  color: #ffffff;
  background: #dc2626;
}

.confirm-delete-btn:hover {
  background: #b91c1c;
}

.confirm-delete-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 520px) {
  .modal-actions {
    grid-template-columns: 1fr;
  }
}


.bundle-card:hover,
.bundle-card.selected {
  border-color: #c99635;
  background: #fff7df;
  transform: translateY(-2px);
  box-shadow:
    0 12px 28px rgba(201, 150, 53, 0.18);
}

.bundle-card span {
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
}

.bundle-card strong {
  display: block;
  margin-top: 8px;
  color: #071926;
  font-size: 24px;
  font-weight: 950;
}

.bundle-card small {
  color: #64748b;
}

/* =========================
   FORM FIELDS
========================= */

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.field label {
  color: #374151;
  font-size: 13px;
  font-weight: 900;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 15px;
  padding: 0 15px;
  color: #111827;
  background: #ffffff;
  outline: none;
  transition: 0.25s ease;
}

.field input,
.field select {
  height: 50px;
}

.field textarea {
  padding-top: 14px;
  resize: vertical;
  min-height: 120px;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #c99635;
  box-shadow:
    0 0 0 4px rgba(201, 150, 53, 0.13);
}

.field small {
  color: #64748b;
  font-size: 12px;
}

/* =========================
   BUTTONS
========================= */

.primary-btn,
.secondary-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 950;
  transition: 0.25s ease;
}

.primary-btn {
  color: #071926;
  background:
    linear-gradient(
      135deg,
      #f5d58c,
      #c99635
    );
}

.secondary-btn {
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #071926,
      #0f2742
    );
}

.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-2px);
}

.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

/* =========================
   SMS ESTIMATE
========================= */

.estimate-box {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0;
}

.estimate-box div {
  padding: 14px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.estimate-box span {
  display: block;
  color: #64748b;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.estimate-box strong {
  display: block;
  margin-top: 6px;
  color: #111827;
  font-size: 19px;
  font-weight: 950;
}

/* =========================
   SENDER ID STATUS
========================= */

.sender-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding: 15px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.sender-status span {
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
}

.sender-status strong,
.history-row strong {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 950;
}

/* =========================
   STATUS COLORS
========================= */

.pending {
  color: #92400e;
  background: #fef3c7;
}

.completed,
.sent,
.approved,
.active {
  color: #065f46;
  background: #d1fae5;
}

.failed,
.rejected,
.suspended {
  color: #991b1b;
  background: #fee2e2;
}

.sender-summary-card {
  position: relative;
}

.delete-sender-btn {
  margin-top: 14px;
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 12px;
  color: #991b1b;
  background: #fee2e2;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.25s ease;
}

.delete-sender-btn:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

/* =========================
   PRICING INFO
========================= */

.pricing-list {
  display: grid;
  gap: 14px;
}

.pricing-list div {
  padding: 16px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.pricing-list span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pricing-list strong {
  display: block;
  margin-top: 6px;
  color: #111827;
}

/* =========================
   HISTORY TABLE
========================= */

.history-table {
  display: grid;
  gap: 8px;
}

.history-row {
  display: grid;
  grid-template-columns: 120px 130px 1fr 110px 110px;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 16px;
  background: #f9fafb;
  color: #374151;
}

.history-head {
  background: #0f2742;
  color: #ffffff;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1200px) {
  .sms-hero {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sms-layout {
    grid-template-columns: 1fr;
  }

  .bundle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .estimate-box {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .history-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .sms-hero {
    padding: 24px;
  }

  .sms-hero h1 {
    font-size: 30px;
  }

  .summary-grid,
  .bundle-grid,
  .estimate-box {
    grid-template-columns: 1fr;
  }

  .sms-card {
    padding: 22px;
  }

  .hero-balance-card {
    min-width: 100%;
  }
}
</style>
