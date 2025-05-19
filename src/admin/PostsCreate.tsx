import { Create, SimpleForm, TextInput, PasswordInput, SelectInput } from "react-admin";
import { useGetIdentity } from "react-admin";



const emailValidation = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
        return "Invalid email format"; 
    }
    return undefined; 
};

const PostsCreate = () => {
    const { identity, isLoading } = useGetIdentity(); 
  
    

    if (isLoading) return <div>Loading...</div>; 
    const isSuperAdmin = identity?.role === "SuperAdmin"; 

    return (
        <Create>
            <SimpleForm>
                <TextInput source="email" required    validate={emailValidation}/>
                <TextInput source="name" />
                <TextInput source="lastName" />
                <TextInput source="account_id" />
                <PasswordInput source="password" required />
                {isSuperAdmin && (
                    <SelectInput
                        source="role"
                        choices={[
                            { id: "user", name: "User" },
                            { id: "admin", name: "Admin" }
                        ]}
                        defaultValue="user"
                    />
                )}
            </SimpleForm>
        </Create>
    );
};

export default PostsCreate;
