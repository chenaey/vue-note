
module.exports = {
    publicPath: './',
    devServer: {
        proxy: {//配置跨域
            '/api': {
                target: 'http://localhost:8002/',//这里后台的地址模拟的;应该填写你们真实的后台接口
                // target: 'http://noteapi.i7code.cn/',
                ws: true,
                changOrigin: true,//允许跨域
                pathRewrite: {
                    '^/api': ''//请求的时候使用这个api就可以
                }
            }

        }
    }

}