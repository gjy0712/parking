<template>
    <div class="home-container">
        <park-header></park-header>
        <park-aside></park-aside>
        <div class="stop-content-box" :class="{'content-collapse':collapse}">
            <div class="stop-content">
                <transition name="move" mode="out-in">
                    <keep-alive >
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".stop-content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
    import ParkHeader from "./header/park-header";
    import ParkAside from "./aside/park-aside";
    import bus from './bus';

    export default {
        name: "home",
        components: {ParkAside, ParkHeader},
        data() {
            return {
                collapse: false,
            }
        },
        created() {
            bus.$on('collapse-content', msg => {
                this.collapse = msg;
            });
        }
    }
</script>

<style lang="less">
    @import "../../assets/style/variables";
    .home-container {
        .stop-content-box {
            position: absolute;
            left: 210px;
            right: 10px;
            top: 80px;
            bottom: 10px;
            padding-bottom: 30px;
            -webkit-transition: left .3s ease-in-out;
            transition: left .3s ease-in-out;
            background: @main-color;
        }

        .stop-content {
            width: auto;
            height: 100%;
            padding: 10px;
            overflow-y: scroll;
            box-sizing: border-box;
        }
    }
</style>