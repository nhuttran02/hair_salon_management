<template>
    <div class="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-2xl font-bold mb-5">Face Swapping API Test</h1>

        <!-- Form Swap -->
        <form @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="img1">Upload Image 1:</label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="file" id="img1" name="img1" @change="handleFileChange($event, 'img1')" accept="image/*"
                    required />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="img2">Upload Image 2:</label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="file" id="img2" name="img2" @change="handleFileChange($event, 'img2')" accept="image/*"
                    required />
            </div>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">
                Swap Faces
            </button>
        </form>

        <!-- Kết quả Face Swapping -->
        <div id="result" class="mt-6">
            <img v-if="resultImageUrl" :src="resultImageUrl" class="mx-auto shadow-lg rounded w-1/2 max-w-md"
                alt="Result Image" />
        </div>

        <!-- Danh sách kiểu tóc Nam -->
        <div class="mt-12 w-full px-8">
            <h2 class="text-xl font-bold mb-5 text-center">Male Hairstyles</h2>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>

            <!-- Error State -->
            <div v-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded">
                {{ error }}
            </div>

            <!-- Hairstyles Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="hairstyle in maleHairstyles" :key="hairstyle.hs_id"
                    class="bg-white shadow-md rounded-lg overflow-hidden transform transition hover:scale-105">
                    <img :src="formatImageUrl(hairstyle.hs_image_url)" :alt="hairstyle.hs_name"
                        class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-2">{{ hairstyle.hs_name }}</h3>
                        <p class="text-gray-600 text-sm line-clamp-3">
                            {{ hairstyle.hs_des }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { REFACE_API } from "@/config/api";

export default {
    data() {
        return {
            img1: null,
            img2: null,
            resultImageUrl: null,
            maleHairstyles: [],
            loading: true,
            error: null,
        };
    },
    methods: {
        handleFileChange(event, imageKey) {
            this[imageKey] = event.target.files[0];
        },

        async submitForm() {
            if (!this.img1 || !this.img2) {
                alert("Please upload both images.");
                return;
            }

            const formData = new FormData();
            formData.append("img1", this.img1);
            formData.append("img2", this.img2);

            try {
                const response = await axios.post(REFACE_API, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status === 200) {
                    const blob = response.data;
                    this.resultImageUrl = URL.createObjectURL(blob);
                } else {
                    alert("Failed to swap faces. Please check your input images.");
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred while processing your request.");
            }
        },

        formatImageUrl(url) {
            // Xử lý đường dẫn hình ảnh
            if (!url) return 'path/to/default/image.jpg';

            // Loại bỏ backslash và thêm đường dẫn đầy đủ
            const cleanUrl = url.replace(/\\/g, '/');
            return `http://localhost:3000/${cleanUrl}`;
        },

        async fetchMaleHairstyles() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get("http://localhost:3000/api/v1/hairstyles/male");

                // Kiểm tra cấu trúc response
                if (response.data && response.data.data && response.data.data.hairstyles) {
                    this.maleHairstyles = response.data.data.hairstyles;
                } else {
                    throw new Error("Invalid response structure");
                }
            } catch (error) {
                console.error("Detailed error:", error);

                if (error.response) {
                    // Server responded with an error
                    this.error = error.response.data.message || "Server error occurred";
                } else if (error.request) {
                    // Request made but no response received
                    this.error = "No response from server. Please check your connection.";
                } else {
                    // Something else went wrong
                    this.error = "An unexpected error occurred";
                }
            } finally {
                this.loading = false;
            }
        },
    },
    created() {
        // Gọi API khi component được tạo
        this.fetchMaleHairstyles();
    },
};
</script>

<style scoped>
/* Optional: Add line-clamp for description */
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Optional: Add smooth transition for hover effects */
.transform {
    transition: transform 0.3s ease;
}
</style>