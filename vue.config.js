
module.exports = {
    publicPath: './',
    devServer: {
        proxy: {//配置跨域
            '/api': {
                target: 'http://localhost:8002/',//这里后台的地址模拟的;
                ws: true,
                changOrigin: true,//允许跨域
                pathRewrite: {
                    '^/api': ''//请求的时候使用这个api就可以
                }
            }

        }
    }

}