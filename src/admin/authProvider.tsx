import axios from 'axios';

const adminAuthProvider = {
    login: async ({ email, password }: { email: string, password: string }) => {
        try {
            const response = await axios.post('https://selewanto.onrender.com/api/auth/admin/login', { email, password });

            const { token, role, id } = response.data; 

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminRole', role);
            localStorage.setItem('adminId', id); 

            return Promise.resolve();
        } catch (error: any) {
            console.error('Login error:', error.response ? error.response.data : error);
            throw new Error('Invalid email or password');
        }
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminId'); 
        return Promise.resolve();
    },

    checkAuth: () => {
        return localStorage.getItem('adminToken') ? Promise.resolve() : Promise.reject();
    },

    checkError: (error: any) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getIdentity: () => {
        const id = localStorage.getItem("adminId"); // Тепер беремо з adminId
        const role = localStorage.getItem("adminRole"); // Беремо з adminRole
        
        console.log("getIdentity called:", { id, role }); 
    
        return Promise.resolve(id ? { id, role } : { id: "", role: "" });
    },

    getPermissions: () => {
        const role = localStorage.getItem('adminRole');
        return role ? Promise.resolve(role) : Promise.reject();
    }
};

export default adminAuthProvider;
