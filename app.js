const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Supabase credentials
const supabaseUrl = 'https://rvqwfoqedppqcdsmjvnu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cXdmb3FlZHBwcWNkc21qdm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDgwMDksImV4cCI6MjA2NDI4NDAwOX0.ZFVtoqRAiDPu1ToHSAkc5xQNN2ZfJ4wcg-jF_zzDUeg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // importante para usar JSON no POST e PUT

// GET - Listar todos os produtos
app.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET - Buscar produto por ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST - Cadastrar novo produto
app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PUT - Atualizar produto por ID
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const { data, error } = await supabase
    .from('products')
    .update({ name, description, price })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE - Deletar produto por ID
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  res.status(204).send(); // Sem conteúdo
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
