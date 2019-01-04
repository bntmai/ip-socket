import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Users = React.lazy(() => import('./views/SocialWeb/Users'));
const UserDetail = React.lazy(() => import('./views/SocialWeb/UserDetail'));
const CreateBlog = React.lazy(() => import('./views/SocialWeb/CreateBlog'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/profile', exact: true, name: 'User Page', component: UserDetail },
  { path: '/create-blog', exact: true, name: 'User Page', component: CreateBlog },
];

export default routes;
