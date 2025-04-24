import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../services/supabase';
import { GoodsIn, Ingredient } from '../types';

const GoodsInPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<GoodsIn>>({
    date: new Date().toISOString(),
    temperature: 0,
    quantity_delivered: 0,
  });

  const queryClient = useQueryClient();

  const { data: ingredients } = useQuery('ingredients', async () => {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*');
    if (error) throw error;
    return data as Ingredient[];
  });

  const { data: employees } = useQuery('employees', async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*');
    if (error) throw error;
    return data;
  });

  const createGoodsIn = useMutation(
    async (newGoodsIn: Partial<GoodsIn>) => {
      // Generate internal batch code
      const selectedIngredient = ingredients?.find(i => i.id === newGoodsIn.ingredient_id);
      const today = new Date();
      const internalBatchCode = `${selectedIngredient?.internal_reference}${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
      
      const { data, error } = await supabase
        .from('goods_in')
        .insert([{ ...newGoodsIn, internal_batch_code: internalBatchCode }])
        .select();
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goods_in');
        setFormData({
          date: new Date().toISOString(),
          temperature: 0,
          quantity_delivered: 0,
        });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ingredient_id && formData.employee_id) {
      createGoodsIn.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Goods In Entry
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <DatePicker
                  label="Date"
                  value={formData.date ? new Date(formData.date) : null}
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      date: date?.toISOString(),
                    }))
                  }
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  select
                  label="Ingredient"
                  name="ingredient_id"
                  value={formData.ingredient_id || ''}
                  onChange={handleChange}
                  required
                >
                  {ingredients?.map((ingredient) => (
                    <MenuItem key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Supplier Batch Code"
                  name="supplier_batch_code"
                  value={formData.supplier_batch_code || ''}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Quantity Delivered"
                  name="quantity_delivered"
                  type="number"
                  value={formData.quantity_delivered}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <DatePicker
                  label="Expiry Date"
                  value={formData.expiry_date ? new Date(formData.expiry_date) : null}
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiry_date: date?.toISOString(),
                    }))
                  }
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Temperature (°C)"
                  name="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Condition"
                  name="condition"
                  value={formData.condition || ''}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Corrective Actions"
                  name="corrective_actions"
                  value={formData.corrective_actions || ''}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  select
                  label="Employee"
                  name="employee_id"
                  value={formData.employee_id || ''}
                  onChange={handleChange}
                  required
                >
                  {employees?.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={createGoodsIn.isLoading}
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default GoodsInPage; 