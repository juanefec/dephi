
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PageHome.vue'),
        name: 'Home',
      },
      {
        path: '/profile/:address',
        component: () => import('pages/PageProfile.vue'),
        name: 'ExploreProfile',
        params: route => ({address: route.params.address}),
      },
      {
        path: '/profile',
        component: () => import('pages/PageProfile.vue'),
        name: 'Profile'
      },
      { 
        path: '/about',
        component: () => import('pages/PageAbout.vue'),
        name: 'About'
      }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/RegisterLayout.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
