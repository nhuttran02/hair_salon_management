<template>
    <div class="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-2xl font-bold mb-5">Face Swapping for Women</h1>

        <!-- Form Swap -->
        <form @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="img1">
                    Upload Image 1:
                </label>
                <div class="flex items-center">
                    <input ref="img1Input"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="file" id="img1" name="img1" @change="handleFileChange($event, 'img1')" accept="image/*"
                        required />
                    <div v-if="img1Preview" class="ml-4 w-20 h-20">
                        <img :src="img1Preview" class="w-full h-full object-cover rounded-md shadow-sm"
                            alt="Image 1 Preview" />
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="img2">
                    Upload Image 2:
                </label>
                <div class="flex items-center">
                    <input ref="img2Input"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="file" id="img2" name="img2" @change="handleFileChange($event, 'img2')" accept="image/*"
                        required />
                    <div v-if="img2Preview" class="ml-4 w-20 h-20">
                        <img :src="img2Preview" class="w-full h-full object-cover rounded-md shadow-sm"
                            alt="Image 2 Preview" />
                    </div>
                </div>
            </div>
            <button
                class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">
                Swap Faces
            </button>
        </form>

        <!-- Kết quả Face Swapping -->
        <div id="result" class="mt-6">
            <img v-if="resultImageUrl" :src="resultImageUrl" class="mx-auto shadow-lg rounded w-1/2 max-w-md"
                alt="Result Image" />
        </div>

        <!-- Hiển thị hình ảnh -->
        <img v-if="resultImage" :src="resultImage" alt="Swap Result" @error="handleImageError" />

        <!-- Thêm log trực tiếp -->
        <div v-if="resultImage">
            Result Image URL: {{ resultImage }}
        </div>

        <!-- Danh sách kiểu tóc Nữ -->
        <div class="mt-12 w-full px-8">
            <h2 class="text-xl font-bold mb-5 text-center">Women Hairstyles</h2>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-pink-500"></div>
            </div>

            <!-- Error State -->
            <div v-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded">
                {{ error }}
            </div>

            <!-- Hairstyles Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="hairstyle in femaleHairstyles" :key="hairstyle.hs_id"
                    class="bg-white shadow-md rounded-lg overflow-hidden transform transition hover:scale-105">
                    <img :src="formatImageUrl(hairstyle.hs_image_url)" :alt="hairstyle.hs_name"
                        class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-2">{{ hairstyle.hs_name }}</h3>
                        <p class="text-gray-600 text-sm line-clamp-3 mb-4">
                            {{ hairstyle.hs_des }}
                        </p>
                        <button @click="selectHairstyleImage(hairstyle.hs_image_url)"
                            class="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded transition duration-300">
                            Swap This Image
                        </button>
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
            img1Preview: null,
            img2Preview: null,
            resultImageUrl: null,
            femaleHairstyles: [],
            loading: true,
            error: null,
            selectedImageToSwap: null,
        };
    },
    methods: {
        handleFileChange(event, imageKey) {
            const file = event.target.files[0];

            // Lưu file
            this[imageKey] = file;

            // Tạo preview
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Động từ imageKey để set preview
                    this[`${imageKey}Preview`] = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                // Nếu không có file, reset preview
                this[`${imageKey}Preview`] = null;
            }

            // Reset selectedImageToSwap nếu cần
            if (this.selectedImageToSwap) {
                this.selectedImageToSwap = null;
            }
        },

        // Điều chỉnh selectHairstyleImage để cập nhật preview
        async selectHairstyleImage(imageUrl) {
            try {
                const fullImageUrl = this.formatImageUrl(imageUrl);

                const response = await axios({
                    method: 'get',
                    url: fullImageUrl,
                    responseType: 'blob'
                });

                const file = new File([response.data], 'hairstyle-image.jpg', {
                    type: response.headers['content-type']
                });

                if (file.size > 0) {
                    this.img2 = file;

                    // Tạo preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.img2Preview = e.target.result;
                    };
                    reader.readAsDataURL(file);

                    // Tạo DataTransfer để set files cho input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    this.$refs.img2Input.files = dataTransfer.files;

                    // Cuộn lên đầu form
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    throw new Error('Invalid file size');
                }
            } catch (error) {
                console.error("Error selecting hairstyle image:", error);
                alert("Could not select this image. Please try a different image.");
            }
        },


        // async submitForm() {
        //     if (!this.img1 || !this.img2) {
        //         alert("Please upload both images.");
        //         return;
        //     }

        //     const formData = new FormData();
        //     formData.append("img1", this.img1);
        //     formData.append("img2", this.img2);

        //     try {
        //         const response = await axios.post(REFACE_API, formData, {
        //             headers: {
        //                 "Content-Type": "multipart/form-data",
        //             },
        //         });

        //         if (response.status === 200) {
        //             const blob = response.data;
        //             this.resultImageUrl = URL.createObjectURL(blob);
        //         } else {
        //             alert("Failed to swap faces. Please check your input images.");
        //         }
        //     } catch (error) {
        //         console.error(error);
        //         alert("An error occurred while processing your request.");
        //     }
        // },

        async submitForm() {
            try {
                // Log chi tiết về img1 và img2
                console.log('Img1 Details:', {
                    type: typeof this.img1,
                    isFile: this.img1 instanceof File,
                    name: this.img1?.name,
                    size: this.img1?.size,
                    fileType: this.img1?.type
                });

                console.log('Img2 Details:', {
                    type: typeof this.img2,
                    isFile: this.img2 instanceof File,
                    name: this.img2?.name,
                    size: this.img2?.size,
                    fileType: this.img2?.type
                });

                // Kiểm tra tính hợp lệ của file
                if (!this.img1 || !this.img2) {
                    console.error('Missing image files');
                    alert('Vui lòng chọn đủ 2 ảnh');
                    return;
                }

                // Kiểm tra và validate file
                const validateFile = (file, fieldName) => {
                    if (!(file instanceof File)) {
                        console.error(`${fieldName} is not a valid File object`);
                        throw new Error(`${fieldName} is invalid`);
                    }

                    if (file.size === 0) {
                        console.error(`${fieldName} has zero size`);
                        throw new Error(`${fieldName} is empty`);
                    }

                    // Kiểm tra loại file (tuỳ theo yêu cầu của bạn)
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (!allowedTypes.includes(file.type)) {
                        console.error(`Invalid file type for ${fieldName}: ${file.type}`);
                        throw new Error(`${fieldName} must be an image`);
                    }

                    return true;
                };

                // Validate files
                validateFile(this.img1, 'Image 1');
                validateFile(this.img2, 'Image 2');

                // Tạo FormData an toàn
                const formData = new FormData();
                formData.append('img1', this.img1);
                formData.append('img2', this.img2);

                // Log FormData để kiểm tra
                for (let [key, value] of formData.entries()) {
                    console.log(`FormData Entry - ${key}:`, {
                        fileName: value.name,
                        fileSize: value.size,
                        fileType: value.type
                    });
                }

                // Gọi API với logging chi tiết
                console.time('SwapFaceAPICall');
                const response = await axios.post(REFACE_API, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    responseType: 'blob',
                    // Thêm timeout để chặn request quá lâu
                    timeout: 30000,
                    // Theo dõi tiến trình upload
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        console.log(`Upload Progress: ${percentCompleted}%`);
                    }
                });
                console.timeEnd('SwapFaceAPICall');

                // Log thông tin response
                console.log('Response Details:', {
                    status: response.status,
                    headers: response.headers,
                    dataSize: response.data?.size
                });

                // Xử lý response an toàn
                if (response.data && response.data.size > 0) {
                    // Tạo URL an toàn
                    const resultImageUrl = URL.createObjectURL(response.data);

                    // Log URL được tạo
                    console.log('Created Object URL:', resultImageUrl);

                    // Cập nhật state
                    this.resultImage = resultImageUrl;
                } else {
                    throw new Error('No image data received');
                }

            } catch (error) {
                // Logging chi tiết cho mọi loại lỗi
                console.error('Swap Face Error Details:', {
                    message: error.message,
                    name: error.name,
                    code: error.code,
                    stack: error.stack,
                    responseData: error.response?.data,
                    responseStatus: error.response?.status
                });

                // Xử lý lỗi chi tiết
                if (error.response) {
                    // Lỗi từ server
                    console.error('Server Error:', {
                        data: error.response.data,
                        status: error.response.status,
                        headers: error.response.headers
                    });
                    alert('Lỗi từ máy chủ: ' + error.response.data);
                } else if (error.request) {
                    // Lỗi kết nối
                    console.error('Network Error:', error.request);
                    alert('Lỗi kết nối. Vui lòng thử lại.');
                } else {
                    // Lỗi khác
                    alert('Đã có lỗi xảy ra: ' + error.message);
                }
            }
        },

        // Hàm cleanup để tránh rò rỉ bộ nhớ
        beforeUnmount() {
            if (this.resultImage) {
                console.log('Revoking Object URL:', this.resultImage);
                URL.revokeObjectURL(this.resultImage);
            }
        },

        formatImageUrl(url) {
            if (!url) return 'path/to/default/image.jpg';

            const cleanUrl = url.replace(/\\/g, '/');
            return `http://localhost:3000/${cleanUrl}`;
        },

        async fetchFemaleHairstyles() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get("http://localhost:3000/api/v1/hairstyles/female");

                if (response.data && response.data.data && response.data.data.hairstyles) {
                    this.femaleHairstyles = response.data.data.hairstyles;
                } else {
                    throw new Error("Invalid response structure");
                }
            } catch (error) {
                console.error("Detailed error:", error);

                if (error.response) {
                    this.error = error.response.data.message || "Server error occurred";
                } else if (error.request) {
                    this.error = "No response from server. Please check your connection.";
                } else {
                    this.error = "An unexpected error occurred";
                }
            } finally {
                this.loading = false;
            }
        },
        handleImageError(event) {
            console.error('Image display error:', event);
            console.log('Image source:', event.target.src);
        }
    },
    created() {
        this.fetchFemaleHairstyles();
    },
};
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.transform {
    transition: transform 0.3s ease;
}
</style>