import Vue from 'vue'
import Router from 'vue-router'
import Search from '@/components/Search'
import ImportData from '@/components/ImportData'
import CreateIndex from '@/components/CreateIndex'
import MappingField from '@/components/MappingField'
import AnalyzeText from '@/components/AnalyzeText'
import Menu from '@/components/Menu'

//메뉴
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { Navbar } from 'bootstrap-vue/es/components';

Vue.use(Router)
Vue.use(Navbar)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Search',
      component: Search
    },
    {
      path: '/create-index',
      name: 'CreateIndex',
      component: CreateIndex
    },
    {
      path: '/mapping-index',
      name: 'MappingField',
      component: MappingField
    },
    {
      path: '/import-data',
      name: 'ImportData',
      component: ImportData
    },
    {
      path: '/analyze-text',
      name: 'AnalyzeText',
      component: AnalyzeText
    },

  ]
})

Vue.component('Menu', Menu);
