import { createApp } from 'vue'
import App from './components/App.vue'
import { store } from './stores';

// AwesomeFont の準備
import { FontAwesomeIcon } from './plugins/awesome-font'

// Bootstrap の準備
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

createApp(App)
    .component('FontAwesome', FontAwesomeIcon) // AwesomeFont 準備
    .use(BootstrapVue3)
    .mount('#app')
