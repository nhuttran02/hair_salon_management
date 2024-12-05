<template>
    <div class="useradmin-container">
        <div class="mb-4 flex justify-between items-center">
            <h1 class="text-2xl px-5">USER ADMINISTRATION</h1>
            <button @click="showAddModal = true" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add New User
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
            Loading users...
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
        </div>

        <!-- User Table -->
        <div v-if="users.length" class="bg-white rounded-lg shadow">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-50 border-b">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gender</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in users" :key="user.ad_id">
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ user.ad_id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ user.ad_username }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ user.ad_name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ user.ad_gender }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ user.ad_phone }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">
                            <button @click="editUser(user)"
                                class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Edit</button>
                            <button @click="deleteUser(user.ad_id)"
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                <div class="text-sm text-gray-500">Total Records: {{ metadata.totalRecords }}</div>
                <div class="flex gap-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">Previous</button>
                    <span class="px-3 py-1">Page {{ currentPage }} of {{ metadata.totalPages }}</span>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === metadata.lastPage"
                        class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>

        <!-- No Data State -->
        <div v-else-if="!loading" class="text-center py-4 bg-white rounded-lg shadow">No users found.</div>

        <!-- Add/Edit Modal -->
        <div v-if="showEditModal || showAddModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-96">
                <h2 class="text -xl font-bold mb-4">{{ showAddModal ? 'Add New User' : 'Edit User' }}</h2>
                <form @submit.prevent="showAddModal ? addUser() : updateUser()">
                    <div class="mb-4">
                        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                        <input v-model="form.ad_username" type="text" id="username" :required="showAddModal"
                            style="padding-left: 0.5rem;"
                            class="mt-1 py-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-green-500" />
                    </div>
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                        <input v-model="form.ad_name" type="text" id="name" :required="showAddModal"
                            style="padding-left: 0.5rem;"
                            class="mt-1 py-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-green-500" />
                    </div>
                    <div class="mb-4">
                        <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                        <select v-model="form.ad_gender" id="gender" :required="showAddModal"
                            style="padding-left: 0.5rem;"
                            class="mt-1 py-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-green-500">
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                        <input v-model="form.ad_phone" type="text" id="phone" :required="showAddModal"
                            style="padding-left: 0.5rem;"
                            class="mt-1 py-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-green-500" />
                    </div>
                    <div class="mb-4">
                        <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                        <input v-model="form.ad_address" type="text" id="address" :required="showAddModal"
                            style="padding-left: 0.5rem;"
                            class="mt-1 py-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-green-500" />
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input v-model="form.ad_password" type="password" id="password" :required="showAddModal"
                            style="padding-left: 0.5rem;"
                            class="mt-1 py-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-green-500" />
                    </div>
                    <div class="flex justify-end">
                        <button type="button" @click="closeModal"
                            class="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{{
                            showAddModal ? 'Add User' : 'Update User' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: [],
            loading: false,
            error: null,
            showAddModal: false,
            showEditModal: false,
            form: {
                ad_username: '',
                ad_name: '',
                ad_gender: '',
                ad_phone: '',
                ad_address: '',
                ad_password: '',
            },
            currentPage: 1,
            metadata: {
                totalRecords: 0,
                totalPages: 1,
            },
        };
    },
    methods: {
        async fetchUsers() {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`/api/v1/admins?page=${this.currentPage}`);
                const data = await response.json();
                this.users = data.data.admins;
                this.metadata = data.data.metadata;
            } catch (err) {
                this.error = 'Failed to load users.';
            } finally {
                this.loading = false;
            }
        },
        async addUser() {
            try {
                const response = await fetch('/api/v1/admins', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form),
                });
                const data = await response.json();
                this.users.push(data.data.admin);
                this.closeModal();
            } catch (err) {
                this.error = 'Failed to add user.';
            }
        },
        async updateUser() {
            try {
                const response = await fetch(`/api/v1/admins/${this.form.ad_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form),
                });
                const data = await response.json();
                const index = this.users.findIndex(user => user.ad_id === this.form.ad_id);
                if (index !== -1) {
                    this.users.splice(index, 1, data.data.admin);
                }
                this.closeModal();
            } catch (err) {
                this.error = 'Failed to update user.';
            }
        },
        async deleteUser(ad_id) {
            try {
                await fetch(`/api/v1/admins/${ad_id}`, {
                    method: 'DELETE',
                });
                this.users = this.users.filter(user => user.ad_id !== ad_id);
            } catch (err) {
                this.error = 'Failed to delete user.';
            }
        },
        editUser(user) {
            this.form = { ...user };
            this.showEditModal = true;
            this.showAddModal = false;
        },
        changePage(page) {
            this.currentPage = page;
            this.fetchUsers();
        },
        closeModal() {
            this.showAddModal = false;
            this.showEditModal = false;
            this.form = {
                ad_username: '',
                ad_name: '',
                ad_gender: '',
                ad_phone: '',
                ad_address: '',
                ad_password: '',
            };
        },
    },
    mounted() {
        this.fetchUsers();
    },
};
</script>

<style scoped>
.useradmin-container {
    padding: 20px;
}
</style>