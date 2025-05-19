import { Admin, Resource, fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import PostsList from './PostsList';
import { UserEdit } from './PostsEdit';
import PostsCreate from './PostsCreate';
import adminAuthProvider from './authProvider';
import CustomLoginPage from './CustomLoginPage';

const apiUrl = 'https://selewanto.onrender.com/api';

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    const token = localStorage.getItem('adminToken');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider(apiUrl, httpClient);

const AdminPanel = () => {
    return (
        <Admin
            basename="/admin"
            loginPage={CustomLoginPage}
            dataProvider={dataProvider}
            authProvider={adminAuthProvider}
        >
            <Resource name="users" options={{ label: "Users" }} list={PostsList} edit={UserEdit} create={PostsCreate} />
        </Admin>
    );
};

export default AdminPanel;
