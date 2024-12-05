<template>
    <div class="hairstyles-container">
        <div class="mb-4 flex justify-between items-center">
            <h1 class="text-2xl px-5">HAIRSTYLE MANAGEMENT</h1>
            <button @click="showAddModal = true" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add New Hairstyle
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">Loading hairstyles...</div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ error }}</div>

        <!-- Hairstyle Table -->
        <div v-if="hairstyles.length" class="bg-white rounded-lg shadow">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-50 border-b">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="hairstyle in hairstyles" :key="hairstyle.hs_id">
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ hairstyle.hs_id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">{{ hairstyle.hs_name }}</td>
                        <!-- <td class="px-6 py-4 whitespace-nowrap text-left">
                            <img :src="hairstyle.hs_image_url" alt="Hairstyle Image" class="w-16 h-16 rounded"
                                @error="onImageError" />
                        </td> -->
                        <td class="px-6 py-4 whitespace-nowrap text-left">
                            <!-- <img :src="`/uploads/hairstyles/${hairstyle.hs_image_url}`" alt="Hairstyle Image"
                                class="w-16 h-16 rounded" @error="onImageError" /> -->
                            <!-- <img :src="`/public/uploads/hairstyles/${hairstyle.hs_image_url}`" alt="Hairstyle Image"
                                class="w-16 h-16 rounded" @error="onImageError" /> -->
                            <!-- <img :src="hairstyle.hs_image_url" alt="Hairstyle Image" class="w-16 h-16 rounded"
                                @error="onImageError" /> -->
                            <!-- <img :src="hairstyle.hs_image_url.startsWith('/public')
                                ? hairstyle.hs_image_url
                                : `/public/${hairstyle.hs_image_url}`" alt="Hairstyle Image" class="w-16 h-16 rounded object-cover"
                                @error="onImageError" /> -->
                            <img :src="hairstyle.hs_image_url" alt="Hairstyle Image"
                                class="w-16 h-16 rounded object-cover" @error=" onImageError" />

                        </td>

                        <td class="px-6 py-4 whitespace-nowrap text-left">
                            {{ hairstyle.hs_des.length > 50 ? hairstyle.hs_des.slice(0, 50) + '...' : hairstyle.hs_des
                            }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-left">
                            <button @click="viewDescription(hairstyle.hs_des)"
                                class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">View
                                Description</button>
                            <button @click="editHairstyle(hairstyle)"
                                class="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">Edit</button>
                            <button @click="deleteHairstyle(hairstyle.hs_id)"
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Data State -->
        <div v-else-if="!loading" class="text-center py-4 bg-white rounded-lg shadow">No hairstyles found.</div>

        <!-- Add/Edit Modal -->
        <div v-if="showEditModal || showAddModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-96">
                <h2 class="text-xl font-bold mb-4">{{ showAddModal ? 'Add New Hairstyle' : 'Edit Hairstyle' }}</h2>
                <form @submit.prevent="showAddModal ? createHairstyle() : updateHairstyle()">
                    <div class="mb-4">
                        <label class="block mb-2">Name</label>
                        <input v-model="editedHairstyle.hs_name" class="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Image URL</label>
                        <input v-model="editedHairstyle.hs_image_url" class="w-full px-3 py-2 border rounded"
                            required />
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Description</label>
                        <textarea v-model="editedHairstyle.hs_des" class="w-full px-3 py-2 border rounded"
                            required></textarea>
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

        <!-- View Description Modal -->
        <div v-if="showDescriptionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-96">
                <h2 class="text-xl font-bold mb-4">Hairstyle Description</h2>
                <p class="mb-4">{{ currentDescription }}</p>
                <button @click="closeDescriptionModal"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
    name: "HairstylesPage",
    setup() {
        const hairstyles = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const showEditModal = ref(false);
        const showAddModal = ref(false);
        const showDescriptionModal = ref(false);
        const currentDescription = ref("");
        const editedHairstyle = ref({
            hs_name: "",
            hs_image_url: "",
            hs_des: "",
        });

        // const fetchHairstyles = async () => {
        //     loading.value = true;
        //     error.value = null;
        //     try {
        //         const response = await fetch("/api/v1/hairstyles");
        //         const data = await response.json();
        //         if (data.status === "success") {
        //             hairstyles.value = data.data.hairstyles;
        //         } else {
        //             throw new Error("Failed to fetch hairstyles");
        //         }
        //     } catch (err) {
        //         error.value = "Error loading hairstyles: " + err.message;
        //     } finally {
        //         loading.value = false;
        //     }
        // };

        const fetchHairstyles = async () => {
            try {
                const response = await fetch("/api/v1/hairstyles");
                const data = await response.json();
                if (data.status === "success") {
                    hairstyles.value = data.data.hairstyles.map(hairstyle => ({
                        ...hairstyle,
                        // Chuyển đổi đường dẫn ảnh nếu cần
                        hs_image_url: hairstyle.hs_image_url.startsWith('/')
                            ? hairstyle.hs_image_url
                            : `/${hairstyle.hs_image_url}`
                    }));
                    console.log('Hairstyles with images:', hairstyles.value);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            }
        };

        const createHairstyle = async () => {
            try {
                const response = await fetch("/api/v1/hairstyles", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedHairstyle.value),
                });
                const data = await response.json();
                if (data.status === "success") {
                    await fetchHairstyles();
                    closeModal();
                } else {
                    throw new Error("Failed to create hairstyle");
                }
            } catch (err) {
                error.value = "Error creating hairstyle: " + err.message;
            }
        };

        const updateHairstyle = async () => {
            try {
                const response = await fetch(`/api/v1/hairstyles/${editedHairstyle.value.hs_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedHairstyle.value),
                });
                const data = await response.json();
                if (data.status === "success") {
                    await fetchHairstyles();
                    closeModal();
                } else {
                    throw new Error("Failed to update hairstyle");
                }
            } catch (err) {
                error.value = "Error updating hairstyle: " + err.message;
            }
        };

        const deleteHairstyle = async (hairstyleId) => {
            if (!confirm("Are you sure you want to delete this hairstyle?")) {
                return;
            }
            try {
                const response = await fetch(`/api/v1/hairstyles/${hairstyleId}`, {
                    method: "DELETE",
                });
                const data = await response.json();
                if (data.status === "success") {
                    await fetchHairstyles();
                } else {
                    throw new Error("Failed to delete hairstyle");
                }
            } catch (err) {
                error.value = "Error deleting hairstyle: " + err.message;
            }
        };

        const closeModal = () => {
            showEditModal.value = false;
            showAddModal.value = false;
            editedHairstyle.value = {
                hs_name: "",
                hs_image_url: "",
                hs_des: "",
            };
        };

        const viewDescription = (description) => {
            currentDescription.value = description;
            showDescriptionModal.value = true;
        };

        const closeDescriptionModal = () => {
            showDescriptionModal.value = false;
            currentDescription.value = "";
        };

        const onImageError = (event) => {
            // Đường dẫn tới ảnh mặc định trong thư mục public của frontend
            event.target.src = '/public/images/default-hairstyle.jpg';


            console.error('Image load error:', event.target.currentSrc);
        };

        onMounted(() => {
            fetchHairstyles();
        });

        return {
            hairstyles,
            loading,
            error,
            showEditModal,
            showAddModal,
            showDescriptionModal,
            currentDescription,
            editedHairstyle,
            createHairstyle,
            updateHairstyle,
            deleteHairstyle,
            closeModal,
            viewDescription,
            closeDescriptionModal,
            onImageError,
        };
    },
};
</script>