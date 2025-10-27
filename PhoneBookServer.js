import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import db from '../db.json' with { type: 'json' };

const app = express();
let persons = db.persons;
const PORT = process.env.port || 3002;
const DB_PATH = './db.json';

app.use(cors());
app.use(express.json());

const saveToFile = async () => {
  try {
    const data = { persons: persons };
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving to file:', error);
  }
};

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.delete('/api/persons/:id', async (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id == id);
  
  if (!person) {
    return response.status(404).json({ error: 'person not found' });
  }
  
  persons = persons.filter(p => p.id != id);
  await saveToFile(); 
  response.status(204).end();
});

app.post('/api/persons', async (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }
  
  const newId = Math.floor(Math.random() * 100000000);
  const newPerson = { 
    name: body.name, 
    number: body.number, 
    id: String(newId) 
  };
  
  persons = persons.concat(newPerson);
  await saveToFile(); 
  response.json(newPerson);
});

app.put('/api/persons/:id', async (request, response) => {
  const id = request.params.id;
  const body = request.body;
  const personIndex = persons.findIndex(p => p.id == id);
  
  if (personIndex === -1) {
    return response.status(404).json({ error: 'person not found' });
  }
  
  persons[personIndex] = { ...persons[personIndex], ...body };
  await saveToFile(); 
  response.json(persons[personIndex]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
