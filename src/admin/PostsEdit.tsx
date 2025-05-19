import { 
    Edit, SimpleForm, TextInput, NumberInput, ArrayInput, 
    SimpleFormIterator, DateInput, SelectInput, BooleanInput,
    required, minLength
  } from 'react-admin';
  import { Box, Typography, Collapse, IconButton, Card, Divider, Grid } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import { useState } from 'react';
  
  export const UserEdit = (props: any) => {
    const [openBalance, setOpenBalance] = useState(false);
  
    const handleBalanceToggle = () => {
      setOpenBalance(!openBalance);
    };
  
    return (
      <Edit {...props}>
        <SimpleForm>
          <Box sx={{ width: '100%', px: 2 }}>
            <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ mb: 2, fontWeight: 'bold', background: 'linear-gradient(45deg, #2196F3, #21CBF3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Дані користувача
              </Typography>
              <TextInput source="email" fullWidth />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextInput source="name" fullWidth />
                <TextInput source="lastName" fullWidth />
              </Box>
              <NumberInput source="account_id" fullWidth sx={{ mt: 2 }} />
              <BooleanInput source="blocked" label="Блокування рахунку" sx={{ mt: 2 }} />
              <TextInput 
              source="password" 
              fullWidth 
              validate={[required(), minLength(6)]} 
            />
            </Card>
  
           
            <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ mb: 2, fontWeight: 'bold', background: 'linear-gradient(45deg, #FF9800, #FF5722)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Транзакції
              </Typography>
              <ArrayInput label="" source="transactions">
                <SimpleFormIterator>
                  <DateInput source="date" fullWidth />
                  <NumberInput source="sum" fullWidth />
                  <TextInput source="country" fullWidth />
                  <SelectInput
                    source="ps"
                    label="Payment System"
                    choices={[
                      { id: 'trc20', name: 'TRC20' },
                      { id: 'eth', name: 'ETH' },
                      { id: 'btc', name: 'BTC' },
                      { id: 'usdtd', name: 'USDTD' },
                      { id: 'usd', name: 'USD' },
                      { id: 'eur', name: 'EUR' },
                    ]}
                    fullWidth
                  />
                  <SelectInput
                    source="status"
                    choices={[
                      { id: 'insurance', name: 'Страховка' },
                      { id: 'failed', name: 'Відміна' },
                      { id: 'tax', name: 'Податок' },
                      { id: 'declaration', name: 'Декларація' },
                      { id: 'pending', name: 'В процесі' },
                      { id: 'completed', name: 'Виконана' },
                    ]}
                    fullWidth
                  />
                </SimpleFormIterator>
              </ArrayInput>
            </Card>

            <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Box 
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} 
                onClick={handleBalanceToggle}
              >
                <Typography 
                  variant="h5"
                  sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #4CAF50, #8BC34A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Баланс
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ transition: '0.3s', transform: openBalance ? 'rotate(180deg)' : 'rotate(0)' }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Collapse in={openBalance}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.trc20" label="TRC20 Balance" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.btc" label="BTC Balance" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.eth" label="ETH Balance" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.usd" label="USD Balance" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.eur" label="EUR Balance" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.usdtd" sx={{fontWeight: 'bold'}} label="USDT Balance" fullWidth />
                  </Grid>
                </Grid>
              </Collapse>
            </Card>
          </Box>
        </SimpleForm>
      </Edit>
    );
  };
  
