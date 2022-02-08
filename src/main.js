import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ELIcons from '@element-plus/icons-vue'

//css
import './assets/css/global.css'

const app = createApp(App);
app.use(store).use(router)
for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}
app.use(ElementPlus).mount('#app')