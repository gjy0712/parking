<template>
    <div class="aside-component">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#f8f8f8"
                text-color="#878787"
                active-text-color="#333333"
                unique-opened
                router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                    v-if="subItem.subs"
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.subs"
                                        :key="i"
                                        :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../bus';
    export default {
        name: "park-aside",
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-s-home',
                        index: 'home',
                        title: '首页'
                    },
                    {
                        icon: 'el-icon-chat-line-round',
                        index: 'userInfo',
                        title: '个人信息'
                    },
                    {
                        icon: 'el-icon-user',
                        index: 'peopleManage',
                        title: '人员管理'
                    },
                    {
                        icon: 'el-icon-truck',
                        index: 'carStationList',
                        title: '车库管理'
                    },
                    {
                        icon: 'el-icon-chat-dot-square',
                        index: 'message',
                        title: '发布公告',
                    },
                    {
                        icon: 'el-icon-suitcase-1',
                        index: 'todayWork',
                        title: '今日工作'
                    }
                ]
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        }
    }
</script>

<style scoped>
    .aside-component {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
        height: 100%;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>