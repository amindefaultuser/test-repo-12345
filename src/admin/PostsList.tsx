import { useGetIdentity, List, Datagrid, TextField, BooleanField, EditButton, DeleteButton, DateField, SelectInput, Filter } from "react-admin";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const RoleFilter = (props: any) => {
    const [admins, setAdmins] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        const fetchAdmins = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/admins`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                }); 
                setAdmins(response.data);
            } catch (error) {
                console.error("Error fetching admins:", error);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <Filter {...props}>
            <SelectInput
                label="Адміністратор"
                source="create_ad"
                choices={admins.map((admin) => ({
                    id: admin.id ,  
                    name: admin.name ,
                }))}       
                         alwaysOn
                sx={{ width: 250, mb: 2 }}
            />
            <SelectInput
                label="Роль"
                source="role"
                choices={[
                    { id: "SuperAdmin", name: "Super Admin" },
                    { id: "admin", name: "Адміністратор" },
                    { id: "user", name: "Користувач" },
                ]}
                alwaysOn
                sx={{ width: 250, mb: 2 }}
            />
        </Filter>
    );
};

const CustomDatagrid = () => {
    return (
        <Datagrid
            rowClick="edit"
            sx={{
                "& .RaDatagrid-headerCell": { fontWeight: "bold", background: "#e3f2fd" },
                "& .RaDatagrid-row:nth-of-type(even)": { background: "#f1f8e9" }
            }}
        >
            <TextField source="email" />
            <TextField source="role" />
            <BooleanField source="blocked" label="Blocked" />
            <TextField source="account_id" />
            <DateField
                source="lastLogin"
                showTime
                options={{ day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }}
            />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    );
};

const PostsList = () => {
    const { identity, isLoading } = useGetIdentity();


    if (isLoading) return <div>Loading...</div>;

    const isSuperAdmin = identity?.role === "SuperAdmin";

    const roleFilter = isSuperAdmin ? {} : { role: "user", create_ad: identity?.id };

    return (
        <List filters={isSuperAdmin ? <RoleFilter /> : undefined} filter={roleFilter}>
            <Box sx={{ p: 2, background: "#f9f9f9", borderRadius: 2 }}>
                <CustomDatagrid />
            </Box>
        </List>
    );
};

export default PostsList;
