<template>
    <!-- component -->
    <div class="bg-gray-100 flex justify-center items-center h-screen">
        <!-- Left: Image -->
        <div class="w-2/3 h-screen hidden lg:block">
            <img src="https://images.pexels.com/photos/705255/pexels-photo-705255.jpeg"
                class="object-cover w-full h-full contrast-50">
        </div>
        <!-- Right: Login Form -->
        <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/3">
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

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async handleLogin() {
            try {
                // const response = await axios.post('http://localhost:3000/api/v1/users/login', {
                //     user_username: this.username,
                //     user_password: this.password,
                // });

                const response = await axios.post('/api/v1/users/login', {
                    user_username: this.username,
                    user_password: this.password,
                });

                // Xử lý điều hướng sau khi đăng nhập
                const userRole = response.data.user_role;

                if (userRole === 1) {
                    // Nếu role là admin
                    this.$router.push('/admin');
                } else {
                    // Nếu role là customer
                    this.$router.push('/');
                }

            } catch (error) {
                alert('Tên người dùng hoặc mật khẩu không chính xác');
            }
        },
    },
};
</script>

<style scoped>

</style>
