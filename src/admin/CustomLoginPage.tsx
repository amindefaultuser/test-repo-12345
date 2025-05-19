import { useLogin, useNotify } from 'react-admin';
import { TextField, Button, Box, Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';

const CustomLoginPage = () => {
    const login = useLogin();
    const notify = useNotify();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        login({ email, password }).catch(() =>
            notify('Invalid email or password', { type: 'error' })
        );
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card sx={{ width: 300, padding: 2 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Admin Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CustomLoginPage;
