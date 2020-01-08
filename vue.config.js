module.exports = {
    chainWebpack: config => {
        //发布模式
        if(process.env.NODE_ENV === 'production'){

            config.
            entry('app').
            clear().
            add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'

            })

            config.plugin('html').tap(args =>{
                args[0].isProd = true
                return args
            })
        }else{
            //开发模式
            config.
            entry('app').
            clear().
            add('./src/main-dev.js')

            config.plugin('html').tap(args =>{
                args[0].isProd = false
                return args
            })

        }
    }
}