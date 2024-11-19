const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let panels = [
  { id: '1', model: 'SolarPanelX', size: '15', power: '300' },
  { id: '2', model: 'SolarPanelY', size: '20', power: '400' },
];

app.get('/panels', (req, res) => {
  res.json(panels);
});

app.post('/panels', (req, res) => {
  const { model, size, power } = req.body;
  const newPanel = { id: Date.now().toString(), model, size, power };
  panels.push(newPanel);
  res.status(201).json(newPanel);
});

app.put('/panels/:id', (req, res) => {
  const { id } = req.params;
  const { model, size, power } = req.body;
  const index = panels.findIndex((p) => p.id === id);

  if (index !== -1) {
    panels[index] = { id, model, size, power };
    res.json(panels[index]);
  } else {
    res.status(404).json({ message: 'Painel solar não encontrado' });
  }
});

app.delete('/panels/:id', (req, res) => {
  const { id } = req.params;
  panels = panels.filter((p) => p.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
