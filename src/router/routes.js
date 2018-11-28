export default [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: () => import('pages/Login'),
    meta: {authorizedOperations: ['NO_OP']}
  },
  {
    path: '/', component: () => import('layouts/RootLayout'),
    meta: {authorizedOperations: ['READ_COMPANY']},
    children: [
      {
        path: '/dashboard',
        component: () => import('pages/Dashboard'),
        meta: {authorizedOperations: ['READ_DASHBOARD']},
        props: true
      },
      {
        path: '/contacts',
        component: () => import('pages/contacts/Contacts'),
        meta: {authorizedOperations: ['READ_CLIENTS']},
        props: true
      },
      {
        path: '/contacts/new',
        component: () => import('pages/contacts/Organization'),
        meta: {authorizedOperations: ['READ_CLIENTS']},
        props: true
      },
      {
        path: '/contacts/modify/:id',
        component: () => import('pages/contacts/Organization'),
        meta: {authorizedOperations: ['READ_CLIENTS']},
        props: true
      },
      {
        path: '/calendar',
        component: () => import('pages/calendar/Calendar'),
        meta: {authorizedOperations: ['READ_CLIENTS']},
        props: true
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
