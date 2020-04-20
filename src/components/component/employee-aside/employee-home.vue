<template>
    <div class="home-container">
        <park-header></park-header>
        <employee-aside></employee-aside>
        <div class="stop-content-box">
            <div class="stop-content">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
                <el-backtop target=".stop-content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
    import EmployeeAside from "./employee-aside";
    import ParkHeader from "../header/park-header";

    export default {
        name: "employee-home",
        components: {ParkHeader, EmployeeAside},

    }
</script>

<style lang="less">
    @import "../../../assets/style/variables";
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