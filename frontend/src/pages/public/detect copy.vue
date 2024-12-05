<!-- <template>
    <div class="flex flex-col items-center justify-top min-h-screen bg-gray-100">
        <h1 class="text-3xl font-bold mb-4 mt-4">HAIRSTYLE SUGGESTION SYSTEM</h1>
        <button @click="startProcess" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Start
        </button>

        <div v-if="showOptions" class="mt-6">
            <h2 class="text-xl">Select image upload method:</h2>
            <button @click="captureImage"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mr-2">
                Camera
            </button>
            <button @click="uploadImage"
                class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                Upload
            </button>
        </div>

        <div v-if="showCamera" class="mt-6">
            <h3 class="text-lg">Take picture</h3>
            <video ref="video" width="300" height="300" autoplay class="border-2 border-gray-300"></video>
            <button @click="takePicture"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-2">
                OK
            </button>
            <canvas ref="canvas" style="display:none;"></canvas>
        </div>

        <div v-if="showUpload" class="mt-6">
            <h3 class="text-lg">Upload</h3>
            <input type="file" @change="onFileChange" accept="image/*" class="mt-2" />
        </div>

        <div v-if="result" class="mt-6">
            <h3 class="text-lg">Khuôn mặt xác định: {{ result }}</h3>
            <h4 class="text-md">Kiểu tóc gợi ý:</h4>
            <ul>
                <li v-for="hairstyle in hairstyles" :key="hairstyle.id" class="text-md">{{ hairstyle.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      showOptions: false,
      showCamera: false,
      showUpload: false,
      result: null,
      hairstyles: [],
    };
  },
  methods: {
    startProcess() {
      this.showOptions = true;
    },
    captureImage() {
      this.showCamera = true;
      this.showUpload = false;
      this.startCamera();
    },
    uploadImage() {
      this.showUpload = true;
      this.showCamera = false;
    },
    startCamera() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.$refs.video.srcObject = stream;
        })
        .catch(err => {
          console.error("Error accessing camera: ", err);
        });
    },
    // takePicture() {
    //   const canvas = this.$refs.canvas;
    //   const context = canvas.getContext('2d');
    //   context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
    //   const imageData = canvas.toDataURL('image/png');
    //   this .processImage(imageData);
    // }
    takePicture() {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');

        // Thiết lập kích thước cho canvas
        canvas.width = this.$refs.video.videoWidth;
        canvas.height = this.$refs.video.videoHeight;

        context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        this.processImage(imageData);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    async processImage(imageData) {
      // Gọi API đến Kaggle để xử lý
      const response = await fetch('http://your-ngrok-url/api/classify', {
        method: 'POST',
        body: JSON.stringify({ image: imageData }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      this.result = data.face_shape; // Giả sử API trả về khuôn mặt
      this.fetchHairstyles(this.result);
    },
    async fetchHairstyles(faceShape) {
      const gender = 'Men'; // Hoặc 'Women' tùy thuộc vào lựa chọn của người dùng
      const response = await fetch(`http://your-ngrok-url/api/hairstyles?face_shape=${faceShape}&gender=${gender}`);
      const data = await response.json();
      this.hairstyles = data.hairstyles; // Giả sử API trả về danh sách kiểu tóc
    }
  }
};
</script> -->




<!-- <template>
    <div class="flex flex-col items-center justify-top min-h-screen bg-gray-100">
        <h1 class="text-3xl font-bold mb-4 mt-4">HAIRSTYLE SUGGESTION SYSTEM</h1>
        <button @click="startProcess" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Start
        </button>

        <div v-if="showOptions" class="mt-6">
            <h2 class="text-xl">Select image upload method:</h2>
            <button @click="captureImage"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mr-2">
                Camera
            </button>
            <button @click="uploadImage"
                class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                Upload
            </button>
        </div>

        <div v-if="showCamera" class="mt-6">
            <h3 class="text-lg">Take picture</h3>
            <video ref="video" width="300" height="300" autoplay class="border-2 border-gray-300"></video>
            <button @click="takePicture"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-2">
                OK
            </button>
            <canvas ref="canvas" style="display:none;"></canvas>
        </div>

        <div v-if="showUpload" class="mt-6">
            <h3 class="text-lg">Upload</h3>
            <input type="file" @change="onFileChange" accept="image/*" class="mt-2" />
        </div>

        <div v-if="result" class="mt-6">
            <h3 class="text-lg">Khuôn mặt xác định: {{ result }}</h3>
            <h4 class="text-md">Kiểu tóc gợi ý:</h4>
            <ul>
                <li v-for="hairstyle in hairstyles" :key="hairstyle.id" class="text-md">{{ hairstyle.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showOptions: false,
            showCamera: false,
            showUpload: false,
            result: null,
            hairstyles: [],
        };
    },
    methods: {
        startProcess() {
            this.showOptions = true;
        },
        captureImage() {
            this.showCamera = true;
            this.showUpload = false;
            this.startCamera();
        },
        uploadImage() {
            this.showUpload = true;
            this.showCamera = false;
        },
        startCamera() {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    this.$refs.video.srcObject = stream;
                })
                .catch(err => {
                    console.error("Error accessing camera: ", err);
                });
        },
        takePicture() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext('2d');

            // Thiết lập kích thước cho canvas
            canvas.width = this.$refs.video.videoWidth;
            canvas.height = this.$refs.video.videoHeight;

            context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png');
            this.processImage(imageData);
        },
        onFileChange(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("File loaded:", e.target.result);
                this.processImage(e.target.result);
            };
            reader.readAsDataURL(file);
        },
        async processImage(imageData) {
            // Gọi API đến Kaggle để xử lý
            const response = await fetch('https://2cfb-34-127-6-10.ngrok-free.app/classify', {
                method: 'POST',
                body: JSON.stringify({ image: imageData }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            this.result = data.predictions[0].label; // Giả sử API trả về kết quả với phần tử predictions
            this.fetchHairstyles(this.result);
        },
        async fetchHairstyles(faceShape) {
            const gender = 'Men'; // Hoặc 'Women' tùy thuộc vào lựa chọn của người dùng
            const response = await fetch(`https://2cfb-34-127-6-10.ngrok-free.app/hairstyles?face_shape=${faceShape}&gender=${gender}`);
            const data = await response.json();
            this.hairstyles = data.hairstyles; // Giả sử API trả về danh sách kiểu tóc
        }
    }
};
</script> -->


<template>
    <div class="flex flex-col items-center justify-top min-h-screen bg-gray-100">
        <h1 class="text-3xl font-bold mb-4 mt-4">HAIRSTYLE SUGGESTION SYSTEM</h1>
        <button @click="startProcess" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Let go !!!
        </button>

        <div v-if="showOptions" class="mt-6">
            <h2 class="text-xl">Select image upload method:</h2>
            <button @click="captureImage"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mr-2">
                Camera
            </button>
            <button @click="uploadImage"
                class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                Upload
            </button>
        </div>

        <div v-if="showCamera" class="mt-6">
            <h3 class="text-lg">Take picture</h3>
            <video ref="video" width="300" height="300" autoplay class="border-2 border-gray-300"></video>
            <button @click="takePicture"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-2">
                OK
            </button>
            <canvas ref="canvas" style="display:none;"></canvas>
        </div>

        <div v-if="showUpload" class="mt-6">
            <h3 class="text-lg">Upload</h3>
            <input type="file" @change="onFileChange" accept="image/*" class="mt-2" />
        </div>

        <div v-if="result" class="mt-6">
            <h3 class="text-lg">Face Shape Detected: {{ result }}</h3>
            <h4 class="text-md mt-4">Select Gender:</h4>
            <button @click="fetchHairstyles('Men')"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-2">
                Men
            </button>
            <button @click="fetchHairstyles('Women')"
                class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition mt-2">
                Women
            </button>
        </div>

        <div v-if="hairstyles.length > 0" class="mt-6">
            <h4 class="text-md">Recommended Hairstyles:</h4>
            <ul>
                <li v-for="hairstyle in hairstyles" :key="hairstyle.id" class="text-md">{{ hairstyle.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showOptions: false,
            showCamera: false,
            showUpload: false,
            result: null,
            hairstyles: [],
        };
    },
    methods: {
        startProcess() {
            this.showOptions = true;
        },
        captureImage() {
            this.showCamera = true;
            this.showUpload = false;
            this.startCamera();
        },
        uploadImage() {
            this.showUpload = true;
            this.showCamera = false;
        },
        startCamera() {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    this.$refs.video.srcObject = stream;
                })
                .catch(err => {
                    console.error("Error accessing camera: ", err);
                });
        },
        // takePicture() {
        //     const canvas = this.$refs.canvas;
        //     const context = canvas.getContext('2d');
        //     canvas.width = this.$refs.video.videoWidth;
        //     canvas.height = this.$refs.video.videoHeight;
        //     context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
        //     const imageData = canvas.toDataURL('image/png');
        //     this.processImage(imageData);
        // }
        // takePicture() {
        //     const canvas = this.$refs.canvas;
        //     const context = canvas.getContext('2d');

        //     // Thiết lập kích thước cho canvas dựa trên kích thước video
        //     canvas.width = this.$refs.video.videoWidth;
        //     canvas.height = this.$refs.video.videoHeight;

        //     // Vẽ hình từ video lên canvas
        //     context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);

        //     // Chuyển đổi canvas thành dữ liệu base64
        //     const imageData = canvas.toDataURL('image/jpeg', 0.8); // Sử dụng 'image/jpeg' để có chất lượng cao hơn

        //     // Gửi hình ảnh đi xử lý
        //     this.processImage(imageData);
        // }
        takePicture() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext('2d');
            const video = this.$refs.video;

            // Thiết lập kích thước cho canvas dựa trên kích thước video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Vẽ hình từ video lên canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Chuyển đổi canvas thành dữ liệu base64
            const imageData = canvas.toDataURL('image/jpeg', 0.8); // Sử dụng 'image/jpeg' để có chất lượng tốt hơn

            // Gửi hình ảnh đi xử lý
            this.processImage(imageData);

            // Tắt camera sau khi chụp xong
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());

            // Đặt lại video srcObject để tắt tiến trình camera
            video.srcObject = null;

            // Hiển thị canvas sau khi chụp
            canvas.style.display = 'block';
            this.showCamera = false;
        },
        // takePicture() {
        //     const canvas = this.$refs.canvas;
        //     const context = canvas.getContext('2d');
        //     canvas.width = this.$refs.video.videoWidth;
        //     canvas.height = this.$refs.video.videoHeight;

        //     // Chụp ảnh từ video và vẽ lên canvas
        //     context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);

        //     // Lấy dữ liệu hình ảnh từ canvas
        //     const imageData = canvas.toDataURL('image/png');
        //     this.processImage(imageData);

        //     // Tắt camera sau khi chụp ảnh
        //     const stream = this.$refs.video.srcObject;
        //     if (stream) {
        //         const tracks = stream.getTracks();
        //         tracks.forEach(track => track.stop());
        //     }

        //     // Ẩn video và hiển thị canvas chứa ảnh đã chụp
        //     this.showCamera = false;
        //     canvas.style.display = 'block';

        //     console.log("Capture success");
        // },
        onFileChange(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("File loaded:", e.target.result);
                this.processImage(e.target.result);
            };
            reader.readAsDataURL(file);
        },
        async processImage(imageData) {
            // Gọi API đến Kaggle để xử lý
            const response = await fetch('https://35b3-34-145-14-110.ngrok-free.app/classify', {
                method: 'POST',
                body: JSON.stringify({ image: imageData }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            this.result = data.predictions[0].label; // Giả sử API trả về kết quả với phần tử predictions
        },
        async fetchHairstyles(gender) {
            const response = await fetch(`https://35b3-34-145-14-110.ngrok-free.app/hairstyles?face_shape=${this.result}&gender=${gender}`);
            const data = await response.json();
            this.hairstyles = data.hairstyles; // Giả sử API trả về danh sách kiểu tóc
        }
    }
};
</script>

<style></style>


<style>

</style>