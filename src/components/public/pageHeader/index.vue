<template>
    <div class="page-header" :class="borderBottom ? 'bottom-line' : ''">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'PageHeader',
        props: {
            borderBottom: {
                type: Boolean,
                default: false
            }
        },
        methods: {}
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/style/variables";
    @import "../../../assets/style/mixins/flex";
    .page-header {
        height: 40px;
        line-height: 40px;
        background-color: @main-color;
        padding-left: 20px;
        .flex();
        .align-items(center);
        &.bottom-line {
            border-bottom: 1px solid #f0f0f0;
        }
    }
</style>
