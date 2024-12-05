<!-- <template>
    <div>
        <h1>Customer List</h1>
        <p-dataTable :value="customers" responsiveLayout="scroll">
            <p-column field="customer_id" header="ID"></p-column>
            <p-column field="customer_name" header="Name"></p-column>
            <p-column field="customer_phone" header="Phone"></p-column>
            <p-column field="customer_email" header="Email"></p-column>
            <p-column field="customer_gender" header="Gender"></p-column>
            <p-column field="customer_created_at" header="Created At"></p-column>
            <p-column field="customer_updated_at" header="Updated At"></p-column>
        </p-dataTable>
    </div>
</template>

<script>
import customerApi from '@/services/customerApi';

export default {
    data() {
        return {
            customers: [],
        };
    },
    mounted() {
        this.fetchCustomers();
    },
    methods: {
        async fetchCustomers() {
            try {
                const response = await customerApi.getCustomers();
                this.customers = response.data.data.customers;
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        },
    },
};
</script>

<style scoped>
h1 {
    font-size: 1.5em;
    margin-bottom: 20px;
}
</style> -->

<!-- -------------------------------------------------------------------------------------------------------------- -->
<template>
    <div class="customers-container">
        <!-- Removed outer padding since it will be handled by master layout -->
        <div class="mb-4 flex justify-between items-center">
            <h1 class="text-2xl px-5">CUSTOMER MANAGEMENT</h1>
            <!-- button de them moi customer -->
            <button @click="showAddModal = true" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add New Customer
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
            Loading customers...
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
        </div>

        <!-- Customer Table -->
        <div v-if="customers.length" class="bg-white rounded-lg shadow">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-50 border-b">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gender</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="customer in customers" :key="customer.customer_id">
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ customer.customer_name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ customer.customer_id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ customer.customer_gender }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ customer.customer_phone }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ customer.customer_email }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">
                            <button @click="editCustomer(customer)"
                                class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                                Edit
                            </button>
                            <button @click="deleteCustomer(customer.customer_id)"
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    Total Records: {{ metadata.totalRecords }}
                </div>
                <div class="flex gap-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">
                        Previous
                    </button>
                    <span class="px-3 py-1">Page {{ currentPage }} of {{ metadata.totalPages }}</span>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === metadata.lastPage"
                        class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- No Data State -->
        <div v-else-if="!loading" class="text-center py-4 bg-white rounded-lg shadow">
            No customers found.
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showEditModal || showAddModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-96">
                <h2 class="text-xl font-bold mb-4">{{ showAddModal ? 'Add New Customer' : 'Edit Customer' }}</h2>
                <form @submit.prevent="showAddModal ? createCustomer() : updateCustomer()">
                    <div class="mb-4">
                        <label class="block mb-2">Name</label>
                        <input v-model="editedCustomer.customer_name" class="w-full px-3 py-2 border rounded"
                            required />
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Gender</label>
                        <select v-model="editedCustomer.customer_gender" class="w-full px-3 py-2 border rounded"
                            required>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Phone</label>
                        <input v-model="editedCustomer.customer_phone" class="w-full px-3 py-2 border rounded"
                            required />
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Email</label>
                        <input v-model="editedCustomer.customer_email" type="email"
                            class="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div class="flex justify-end gap-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            {{ showAddModal ? 'Create' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
    name: 'CustomersPage',
    setup() {
        const customers = ref([])
        const metadata = ref({
            totalRecords: 0,
            totalPages: 1,
            lastPage: 1,
            page: 1,
            limit: 5
        })
        const loading = ref(false)
        const error = ref(null)
        const currentPage = ref(1)
        const showEditModal = ref(false)
        const showAddModal = ref(false)
        const editedCustomer = ref({
            customer_name: '',
            customer_gender: 'male',
            customer_phone: '',
            customer_email: ''
        })

        const fetchCustomers = async (page = 1) => {
            loading.value = true
            error.value = null
            try {
                const response = await fetch(`/api/v1/customers?page=${page}`)
                const data = await response.json()

                if (data.status === 'success') {
                    customers.value = data.data.customers
                    metadata.value = data.data.metadata
                    currentPage.value = page
                } else {
                    throw new Error('Failed to fetch customers')
                }
            } catch (err) {
                error.value = 'Error loading customers: ' + err.message
            } finally {
                loading.value = false
            }
        }

        const changePage = (page) => {
            if (page >= 1 && page <= metadata.value.lastPage) {
                fetchCustomers(page)
            }
        }

        const closeModal = () => {
            showEditModal.value = false
            showAddModal.value = false
            editedCustomer.value = {
                customer_name: '',
                customer_gender: 'male',
                customer_phone: '',
                customer_email: ''
            }
        }

        const editCustomer = (customer) => {
            editedCustomer.value = { ...customer }
            showEditModal.value = true
        }

        const createCustomer = async () => {
            try {
                const response = await fetch('/api/v1/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editedCustomer.value),
                })

                const data = await response.json()

                if (data.status === 'success') {
                    await fetchCustomers(currentPage.value)
                    closeModal()
                } else {
                    throw new Error('Failed to create customer')
                }
            } catch (err) {
                error.value = 'Error creating customer: ' + err.message
            }
        }

        const updateCustomer = async () => {
            try {
                const response = await fetch(`/api/v1/customers/${editedCustomer.value.customer_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editedCustomer.value),
                })

                const data = await response.json()

                if (data.status === 'success') {
                    const index = customers.value.findIndex(c => c.customer_id === editedCustomer.value.customer_id)
                    if (index !== -1) {
                        customers.value[index] = data.data.customer
                    }
                    closeModal()
                } else {
                    throw new Error('Failed to update customer')
                }
            } catch (err) {
                error.value = 'Error updating customer: ' + err.message
            }
        }

        const deleteCustomer = async (customerId) => {
            if (!confirm('Are you sure you want to delete this customer?')) {
                return
            }

            try {
                const response = await fetch(`/api/v1/customers/${customerId}`, {
                    method: 'DELETE',
                })

                const data = await response.json()

                if (data.status === 'success') {
                    // Refresh current page
                    await fetchCustomers(currentPage.value)
                } else {
                    throw new Error('Failed to delete customer')
                }
            } catch (err) {
                error.value = 'Error deleting customer: ' + err.message
            }
        }

        onMounted(() => {
            fetchCustomers()
        })

        return {
            customers,
            metadata,
            loading,
            error,
            currentPage,
            showEditModal,
            showAddModal,
            editedCustomer,
            changePage,
            editCustomer,
            createCustomer,
            updateCustomer,
            deleteCustomer,
            closeModal
        }
    }
}
</script>

<!-- -------------------------------------------------------------------------------------------------------------- -->