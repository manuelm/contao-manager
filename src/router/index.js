import Vue from 'vue';
import Router from 'vue-router';

import Login from '../components/Login';
import Install from '../components/Install';
import SelfTest from '../components/SelfTest';
import Packages from '../components/packages/Base';
import PackagesList from '../components/packages/List';
import PackagesSearch from '../components/packages/Search';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            name: 'login',
            path: '/login',
            component: Login,
        },
        {
            name: 'install',
            path: '/install',
            component: Install,
        },
        {
            name: 'selftest',
            path: '/selftest',
            component: SelfTest,
        },
        {
            path: '/packages',
            component: Packages,
            children: [
                {
                    name: 'packages',
                    path: '',
                    component: PackagesList,
                },
                {
                    name: 'packages-search',
                    path: 'search',
                    component: PackagesSearch,
                    props: true,
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.name === null || (router.allowed !== undefined && router.allowed !== to.name)) {
        next(false);
    } else {
        next();
    }
});

export default router;
