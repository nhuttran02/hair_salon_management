<template>
    <div class="hairstyles-container">
        <div class="mb-4 flex justify-between items-center">
            <h1 class="text-2xl px-5">HAIRSTYLE MANAGEMENT</h1>
            <button @click="showAddModal = true" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add New Hairstyle
            </button>
        </div>

        <!-- Easy DataTable -->
        <EasyDataTable :headers="headers" :items="hairstyles" :loading="loading" empty-message="No hairstyles found">
            <!-- Image Column Template -->
            <template #item-hs_image_url="{ hs_image_url }">
                <img :src="hs_image_url" alt="Hairstyle Image" class="w-16 h-16 rounded object-cover"
                    @error="onImageError" />
            </template>

            <!-- Description Column Template -->
            <template #item-hs_des="{ hs_des }">
                {{ hs_des.length > 50 ? hs_des.slice(0, 50) + '...' : hs_des }}
            </template>

            <!-- Actions Column Template -->
            <template #item-actions="{ hs_id, ...hairstyle }">
                <div class="flex space-x-2">
                    <button @click="viewDescription(hairstyle.hs_des)"
                        class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                        View
                    </button>
                    <button @click="editHairstyle(hairstyle)"
                        class="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                        Edit
                    </button>
                    <button @click="deleteHairstyle(hs_id)"
                        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Delete
                    </button>
                </div>
            </template>
        </EasyDataTable>

        <!-- Modals (Giữ nguyên như code cũ) -->
        <!-- Add/Edit Modal -->
        <div v-if="showEditModal || showAddModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <!-- Nội dung modal như cũ -->
        </div>

        <!-- View Description Modal -->
        <div v-if="showDescriptionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <!-- Nội dung modal như cũ -->
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

export default {
    name: "HairstylesPage",
    components: {
        EasyDataTable
    },
    setup() {
        // Thêm headers cho DataTable
        const headers = [
            { text: 'ID', value: 'hs_id', sortable: true },
            { text: 'Name', value: 'hs_name', sortable: true },
            { text: 'Image', value: 'hs_image_url' },
            { text: 'Description', value: 'hs_des' },
            { text: 'Actions', value: 'actions' }
        ]

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

        const fetchHairstyles = async () => {
            loading.value = true;
            error.value = null;
            try {
                const response = await fetch("/api/v1/hairstyles");
                const data = await response.json();
                if (data.status === "success") {
                    hairstyles.value = data.data.hairstyles.map(hairstyle => ({
                        ...hairstyle,
                        hs_image_url: hairstyle.hs_image_url.startsWith('/')
                            ? hairstyle.hs_image_url
                            : `/${hairstyle.hs_image_url}`
                    }));
                } else {
                    throw new Error("Failed to fetch hairstyles");
                }
            } catch (err) {
                error.value = "Error loading hairstyles: " + err.message;
            } finally {
                loading.value = false;
            }
        };

        // Giữ nguyên các hàm khác như code cũ (createHairstyle, updateHairstyle, deleteHairstyle, v.v.)
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
            currentDescription.value = description; showDescriptionModal.value = true;
        };

        const closeDescriptionModal = () => {
            showDescriptionModal.value = false;
            currentDescription.value = "";
        };

        const onImageError = (event) => {
            event.target.src = '/public/images/default-hairstyle.jpg';
            console.error('Image load error:', event.target.currentSrc);
        };

        onMounted(() => {
            fetchHairstyles();
        });

        return {
            headers,
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