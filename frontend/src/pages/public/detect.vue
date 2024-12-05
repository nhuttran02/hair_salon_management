<template>
    <div class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
                FACE SHAPE DETECTOR
            </h1>

            <div class="mb-4">
                <!-- Nút chọn file -->
                <input type="file" id="fileInput" accept="image/*" class="hidden" @change="previewImage">
                <label for="fileInput"
                    class="block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">
                    Upload
                </label>
            </div>

            <!-- Nút mở camera -->
            <div class="mb-4 text-center">
                <button @click="toggleCamera"
                    class="block w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 cursor-pointer mb-4">
                    Take a photo
                </button>
                <!-- Video preview từ camera -->
                <video v-if="isCameraOn" ref="video" class="w-full rounded mb-4" autoplay></video>
                <button v-if="isCameraOn" @click="captureImage"
                    class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center">
                    Chụp Ảnh
                </button>
            </div>

            <!-- Xem trước ảnh đã chọn hoặc đã chụp -->
            <div class="mb-4 text-center">
                <img v-if="imagePreview" :src="imagePreview" id="imagePreview"
                    class="max-w-full max-h-64 mx-auto mb-4 rounded" alt="Ảnh xem trước">
            </div>

            <!-- Nút gửi yêu cầu nhận diện -->
            <button id="uploadBtn" @click="predictFaceShape" :disabled="loading"
                class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center">
                <svg v-if="loading" class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                Submit
            </button>

            <div id="result" class="mt-4">
                <div v-if="result"
                    class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Result: </strong>
                    <span class="block sm:inline">{{ result }}</span>
                </div>
                <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert">
                    Đã xảy ra lỗi: {{ error }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { FACE_DETECT_API } from '@/config/api';

export default {
    data() {
        return {
            selectedFile: null,
            imagePreview: null,
            loading: false,
            result: null,
            error: null,
            isCameraOn: false,
        };
    },
    methods: {
        previewImage(event) {
            this.selectedFile = event.target.files[0];
            if (this.selectedFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(this.selectedFile);
            }
        },
        toggleCamera() {
            this.isCameraOn = !this.isCameraOn;
            if (this.isCameraOn) {
                this.startCamera();
            } else {
                this.stopCamera();
            }
        },
        startCamera() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream) => {
                        this.$refs.video.srcObject = stream;
                    })
                    .catch((error) => {
                        console.error("Không thể truy cập camera:", error);
                    });
            }
        },
        stopCamera() {
            const video = this.$refs.video;
            if (video && video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
                video.srcObject = null;
            }
        },
        // captureImage() {
        //     const video = this.$refs.video;
        //     const canvas = document.createElement('canvas');
        //     canvas.width = video.videoWidth;
        //     canvas.height = video.videoHeight;
        //     const context = canvas.getContext('2d');
        //     context.drawImage(video, 0, 0, canvas.width, canvas.height);

        //     // Convert canvas to data URL
        //     this.imagePreview = canvas.toDataURL('image/png');
        //     canvas.toBlob((blob) => {
        //         this.selectedFile = new File([blob], 'captured.png', { type: 'image/png' });
        //     });
        // },
        captureImage() {
            const video = this.$refs.video;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to data URL
            this.imagePreview = canvas.toDataURL('image/png');
            canvas.toBlob((blob) => {
                this.selectedFile = new File([blob], 'captured.png', { type: 'image/png' });
            });

            // Ngừng camera sau khi chụp
            this.stopCamera();
            this.isCameraOn = false;
        },
        // async predictFaceShape() {
        //     if (!this.selectedFile) {
        //         alert('Vui lòng chọn hoặc chụp một ảnh');
        //         return;
        //     }

        //     this.loading = true;
        //     this.result = null;
        //     this.error = null;

        //     const formData = new FormData();
        //     formData.append('file', this.selectedFile);

        //     try {
        //         const response = await axios.post(FACE_DETECT_API, formData, {
        //             headers: {
        //                 'Content-Type': 'multipart/form-data',
        //             },
        //         });

        //         if (response.data.class) {
        //             this.result = response.data.class;
        //         } else {
        //             this.error = "Không thể nhận diện hình ảnh";
        //         }
        //     } catch (error) {
        //         this.error = `Đã xảy ra lỗi: ${error.message}`;
        //     } finally {
        //         this.loading = false;
        //     }
        // },
        async predictFaceShape() {
            if (!this.selectedFile) {
                alert('Please select or take a photo');
                return;
            }

            this.loading = true;
            this.result = null;
            this.error = null;

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            try {
                // Gửi yêu cầu tới Flask API qua proxy
                const response = await axios.post(FACE_DETECT_API, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.class) {
                    this.result = response.data.class;
                } else {
                    this.error = "Unable to recognize face shape";
                }
            } catch (error) {
                // Kiểm tra mã trạng thái lỗi
                if (error.response && error.response.status === 413) {
                    this.error = "The image size is too large, please choose an image with the appropriate size";
                } else {
                    this.error = `Error: ${error.message}`;
                }
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
#uploadBtn[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>
