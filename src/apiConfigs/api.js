export default {
    timeout: 60 * 1000, // 超时请求时间，单位：毫秒
    successStatusCode: 1,
    prefix: {
        dev: '/',
        test: '/',
        sim: '/',
        prod: '/'
    },
    suffix: {
        // 后缀代表接口去掉prefix的部分，这里可以是无限级的树状结构，根据自己的需要
        user: {
            // 用户
            login: '/user/login', // 登录
            updateType: '/user/updateType', // 更改用户权限类型
            updateStatus: '/user/updateStatus', // 更改用户状态
            deleteUser: '/user/deleteUser', // 删除用户
            insertUser: '/user/insertUser', // 新增用户
            updateUser: '/user/updateUser', // // 编辑用户信息
            updatePassword: '/user/updatePassword', // 修改密码
            getUserList: '/user/getUserList', // // 获取用户列表,
            searchUser: '/user/searchUser' // 查询用户
        },
        garage: {
            // 获取车库列表
            getGarageList: '/garage/getGarageList', // 获取车库列表
            insertGarage: '/garage/insertGarage', // 新增车库信息
            deleteGarage: '/garage/deleteGarage', // 删除车库
            updateGarage: '/garage/updateGarage', // 更新车库信息,
            getGarage: '/garage/getGarage', //获取具体车库信息
            getTotalCarInfo: '/garage/getTotalCarInfo', // 停车场车库车位信息
            getGarageNameList: '/garage/getGarageNameList' // 获取车库名列表

        },
        car: {
            // 车位信息
            getCarList: '/car/getCarList', // 分页获取停车位列表
            insertCar: '/car/insertCar', // 新增车位信息
            updateCar: '/car/updateCar', // 修改车位信息
            deleteCar: '/car/deleteCar', // 删除车位信息
        },
        message: {
            // 新增公告
            insertMessage: '/message/insertMessage', // 新增公告
            deleteMessage: '/message/deleteMessage', // 删除公告
            getMessageList: '/message/getMessageList' // 获取公告列表
        },
        order: {
            // 今日车辆信息
            getTodayOrderList: '/order/getTodayOrderList', // 获取今日车辆信息
            getCarOrder: '/order/getCarOrder', // 获取当前车位车辆信息
            addCarOrder: '/order/addCarOrder', // 车辆入库新增订单
            updateCarOrder: '/order/updateCarOrder', // 车辆车库修改订单
            searchCarOrder: '/order/searchCarOrder' // 搜索车辆
        }
    }
}
