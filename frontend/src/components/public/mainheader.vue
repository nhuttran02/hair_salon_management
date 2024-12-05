<template>
    <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <!-- Logo Section -->
            <div class="flex items-center">
                <img :src="logo" :alt="brandName" class="mr-2 w-10 h-10" />
                <span class="text-2xl font-bold">{{ brandName }}</span>
            </div>

            <!-- Navigation Menu -->
            <nav class="flex items-center space-x-4">
                <div v-for="(item, index) in menuItems" :key="index" class="relative group">
                    <div class="px-5">
                        <button v-if="item.submenu"
                            class="text-gray-700 font-medium hover:text-red-500 transition-colors">
                            <i v-if="item.icon" :class="item.icon"></i>
                            {{ item.label }}
                        </button>
                        <router-link v-else :to="item.path"
                            class="text-gray-700 font-medium hover:text-red-500 transition-colors">
                            <i v-if="item.icon" :class="item.icon"></i>
                            {{ item.label }}
                        </router-link>
                    </div>

                    <!-- Dropdown Menu -->
                    <div v-if="item.submenu"
                        class="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-50">
                        <router-link v-for="(subItem, subIndex) in item.submenu" :key="subIndex" :to="subItem.path"
                            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                            <i v-if="subItem.icon" :class="subItem.icon"></i>
                            {{ subItem.label }}
                        </router-link>
                    </div>
                </div>
            </nav>

            <!-- Action Button -->
            <div class="flex items-center space-x-2">
                <template v-if="isLoggedIn && userRole === 2">
                    <span class="text-gray-700">Hello, {{ username }}</span>
                    <button @click="logout"
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        LOGOUT
                    </button>
                </template>
                <template v-else>
                    <button @click="$router.push('/register')"
                        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                        REGISTER
                    </button>
                    <button @click="$router.push('/login')"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        LOGIN
                    </button>
                </template>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'MainHeader',
    data() {
        return {
            brandName: 'NT SALON',
            logo: 'https://static.vecteezy.com/system/resources/previews/015/236/461/large_2x/male-hairstyle-design-illustration-vector.jpg',
            menuItems: [
                {
                    label: 'HOME',
                    path: '/home',
                    icon: 'pi pi-home',
                },
                {
                    label: 'BOOKING',
                    path: '/booking',
                    icon: 'pi pi-calendar',
                },
                {
                    label: 'HAIR STYLE',
                    path: '/hair',
                    icon: 'pi pi-star',
                    submenu: [
                        { label: 'Men', path: '/hair/men' },
                        { label: 'Women', path: '/hair/women' }
                    ]
                },
                {
                    label: 'DETECT',
                    path: '/detect',
                    icon: 'pi pi-image',
                },
                {
                    label: 'ABOUT US',
                    path: '/about',
                    icon: 'pi pi-info-circle',
                },
            ],
            isLoggedIn: false,
            username: '',
            userRole: null,
        };
    },
    methods: {
        logout() {
            this.isLoggedIn = false;
            this.username = '';
            this.userRole = null;

            // Xóa thông tin đăng nhập khỏi localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('jwtToken');

            // Chuyển hướng người dùng về trang chủ
            this.$router.push('/home');

            // Hiển thị thông báo đăng xuất thành công
            this.$toast.add({
                severity: 'success',
                summary: 'Logout',
                detail: 'Logged out successfully',
                life: 3000
            });
        },
        checkLoginStatus() {
            // Lấy thông tin từ localStorage và cập nhật trạng thái đăng nhập
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.user_role === 2) {
                this.isLoggedIn = true;
                this.username = user.user_username;
                this.userRole = user.user_role;
            } else {
                this.isLoggedIn = false;
                this.username = '';
                this.userRole = null;
            }
        }
    },
    mounted() {
        // Kiểm tra trạng thái đăng nhập khi component được mount
        this.checkLoginStatus();

        // Kiểm tra trạng thái đăng nhập mỗi khi có sự thay đổi
        window.addEventListener('storage', this.checkLoginStatus);
    },
    beforeUnmount() {
        // Loại bỏ sự kiện khi component bị hủy
        window.removeEventListener('storage', this.checkLoginStatus);
    }
};
</script>

<style scoped>
.group:hover .group-hover\:block {
    display: block;
}

.transition-colors {
    transition: all 0.3s ease;
}

.group {
    padding-bottom: 0.5rem;
}

.group>div[class*="absolute"] {
    margin-top: 0.5rem;
    margin-left: 0.5rem;
}

.group>div[class*="absolute"] {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.group:hover>div[class*="absolute"] {
    opacity: 1;
    transform: translateY(0);
}

.group>div[class*="absolute"] a {
    display: flex;
    align-items: center;
}
</style>