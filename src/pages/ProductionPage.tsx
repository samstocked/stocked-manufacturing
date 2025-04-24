import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../services/supabase';
import { ProductionBatch, Recipe } from '../types';

const ProductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<Partial<ProductionBatch>>({
    production_date: new Date().toISOString(),
    batch_multiplier: 1,
  });

  const queryClient = useQueryClient();

  const { data: recipes } = useQuery('recipes', async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*');
    if (error) throw error;
    return data as Recipe[];
  });

  const { data: employees } = useQuery('employees', async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*');
    if (error) throw error;
    return data;
  });

  const createProductionBatch = useMutation(
    async (newBatch: Partial<ProductionBatch>) => {
      const { data, error } = await supabase
        .from('production_batches')
        .insert([newBatch])
        .select();
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('production_batches');
        setFormData({
          production_date: new Date().toISOString(),
          batch_multiplier: 1,
        });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.recipe_id && formData.employee_id) {
      createProductionBatch.mutate(formData);
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
        Production Management
      </Typography>
      <Tabs value={activeTab} onChange={(_, newValue: number) => setActiveTab(newValue)}>
        <Tab label="Create Batch" />
        <Tab label="Log Ingredients" />
      </Tabs>
      <Paper sx={{ p: 3, mt: 2 }}>
        {activeTab === 0 && (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <DatePicker
                    label="Production Date"
                    value={formData.production_date ? new Date(formData.production_date) : null}
                    onChange={(date: Date | null) =>
                      setFormData((prev) => ({
                        ...prev,
                        production_date: date?.toISOString(),
                      }))
                    }
                  />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    select
                    label="Recipe"
                    name="recipe_id"
                    value={formData.recipe_id || ''}
                    onChange={handleChange}
                    required
                  >
                    {recipes?.map((recipe) => (
                      <MenuItem key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Batch Multiplier"
                    name="batch_multiplier"
                    type="number"
                    value={formData.batch_multiplier}
                    onChange={handleChange}
                    required
                  />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Packaging Batch Number"
                    name="packaging_batch_number"
                    value={formData.packaging_batch_number || ''}
                    onChange={handleChange}
                    required
                  />
                </Box>
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes || ''}
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
              <Box sx={{ width: '100%' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={createProductionBatch.isLoading}
                >
                  Create Batch
                </Button>
              </Box>
            </Stack>
          </form>
        )}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Log Ingredients for Batch
            </Typography>
            {/* Add ingredient logging form here */}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProductionPage; 