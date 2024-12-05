<template>
    <!-- component -->
    <div class="bg-gray-100 flex justify-center items-center h-screen">
        <!-- Left: Image -->
        <div class="w-1/2 h-screen hidden lg:block">
            <img src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
                alt="Placeholder Image" class="object-cover w-full h-full">
        </div>
        <!-- Right: Login Form -->
        <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
            <h1 class="text-2xl font-semibold mb-4">Login</h1>
            <form @submit.prevent="handleLogin"> <!-- Thay đổi method="POST" thành @submit.prevent -->
                <!-- Username Input -->
                <div class="mb-4">
                    <label for="username" class="block text-gray-600">Username</label>
                    <input v-model="username" type="text" id="username" name="username"
                        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autocomplete="off">
                </div>
                <!-- Password Input -->
                <div class="mb-4">
                    <label for="password" class="block text-gray-600">Password</label>
                    <input v-model="password" type="password" id="password" name="password"
                        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autocomplete="off">
                </div>
                <!-- Remember Me Checkbox -->
                <div class="mb-4 flex items-center">
                    <input type="checkbox" id="remember" name="remember" class="text-blue-500">
                    <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
                </div>
                <!-- Forgot Password Link -->
                <div class="mb-6 text-blue-500">
                    <a href="#" class="hover:underline">Forgot Password?</a>
                </div>
                <!-- Login Button -->
                <button type="submit"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
            </form>
            <!-- Sign up Link -->
            <div class="mt-6 text-blue-500 text-center">
                <a href="#" class="hover:underline">Sign up Here</a>
            </div>
        </div>
    </div>
</template>

<!-- <script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            error: null,
        };
    },
    methods: {
        async handleLogin() {
            try {
                // Gửi yêu cầu đăng nhập tới backend
                const response = await axios.post('/api/login', {
                    username: this.username,
                    password: this.password,
                }, {
                    withCredentials: true // Quan trọng để cookie được gửi kèm
                });

                if (response.status === 200) {
                    // Lưu token hoặc sử dụng cookie cho đăng nhập
                    localStorage.setItem('token', response.data.token);

                    // Chuyển hướng hoặc cập nhật trạng thái đăng nhập trong ứng dụng
                    this.$router.push({ name: 'dashboard' }); // Chuyển hướng tới trang dashboard sau khi đăng nhập thành công
                }
            } catch (error) {
                console.error('Login failed:', error.response?.data?.message || error.message);
                this.error = 'Login failed: ' + (error.response?.data?.message || 'Unknown error');
                alert(this.error);
            }
        },
    },
};
</script> -->

<script>
import axios from 'axios';

export default {
    data() {
        return {
            credentials: {
                user_username: this.username,
                user_password: this.password
            },
            username: '',
            password: '',
            errorMessage: ''
        };
    },
    methods: {
        async handleLogin() {
            try {
                // Cập nhật credentials trước khi gửi
                this.credentials.user_username = this.username;
                this.credentials.user_password = this.password;

                // Gửi yêu cầu đăng nhập tới backend
                const response = await axios.post('/api/auth/login', this.credentials);

                // Lưu thông tin user vào store
                this.$store.commit('setUser', response.data.user);

                // Chuyển hướng dựa trên role
                if (response.data.user.role === 1) {  // Giả sử role 1 là admin
                    this.$router.push('/admin');
                } else {
                    this.$router.push('/');
                }
            } catch (error) {
                // Xử lý lỗi đăng nhập
                this.errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
            }
        },
    },
};
</script>

<style scoped>
/* CSS của bạn, nếu cần */
</style>
