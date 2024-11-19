import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Panel {
  id: string;
  model: string;
  size: string;
  power: string;
}

const SolarPanelManagementScreen = () => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [model, setModel] = useState('');
  const [size, setSize] = useState('');
  const [power, setPower] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = 'http://localhost:3000/panels';

  useEffect(() => {
    loadPanels();
  }, []);

  const loadPanels = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch from server');
      const data = await response.json();
      setPanels(data);
      await AsyncStorage.setItem('solarPanels', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to load panels from server, trying AsyncStorage', error);
      try {
        const jsonValue = await AsyncStorage.getItem('solarPanels');
        const storedPanels: Panel[] = jsonValue ? JSON.parse(jsonValue) : [];
        setPanels(storedPanels);
      } catch (error) {
        console.error('Failed to load panels from AsyncStorage', error);
      }
    }
  };

  const savePanels = async (newPanels: Panel[]) => {
    try {
      await AsyncStorage.setItem('solarPanels', JSON.stringify(newPanels));
    } catch (error) {
      console.error('Failed to save panels to AsyncStorage', error);
    }
  };

  const addOrUpdatePanel = async () => {
    if (!model || !size || !power) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const panelData = { model, size, power };

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...panelData, id: editingId }),
        });
        const updatedPanel = await response.json();
        setPanels((prev) =>
          prev.map((item) => (item.id === updatedPanel.id ? updatedPanel : item))
        );
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...panelData, id: Date.now().toString() }),
        });
        const newPanel = await response.json();
        setPanels((prev) => [...prev, newPanel]);
      }
      await savePanels([...panels, { ...panelData, id: editingId || Date.now().toString() }]);
      clearInputs();
    } catch (error) {
      console.error('Failed to save panel', error);
    }
  };

  const editPanel = (id: string) => {
    const panelToEdit = panels.find((item) => item.id === id);
    if (panelToEdit) {
      setModel(panelToEdit.model);
      setSize(panelToEdit.size);
      setPower(panelToEdit.power);
      setEditingId(id);
    }
  };

  const deletePanel = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setPanels((prev) => prev.filter((item) => item.id !== id));
      await savePanels(panels.filter((item) => item.id !== id));
      Alert.alert('Sucesso', 'Painel solar excluído com sucesso!');
    } catch (error) {
      console.error('Failed to delete panel', error);
      Alert.alert('Erro', 'Não foi possível excluir o painel solar.');
    }
  };

  const clearInputs = () => {
    setModel('');
    setSize('');
    setPower('');
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Painéis Solares</Text>
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={model}
        onChangeText={setModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Tamanho (m²)"
        value={size}
        keyboardType="numeric"
        onChangeText={setSize}
      />
      <TextInput
        style={styles.input}
        placeholder="Potência (kW)"
        value={power}
        keyboardType="numeric"
        onChangeText={setPower}
      />
      <Button title={editingId ? 'Atualizar Painel' : 'Adicionar Painel'} onPress={addOrUpdatePanel} />
      <FlatList
        data={panels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>
              {item.model}, {item.size} m², {item.power} kW
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => editPanel(item.id)}>
                <Icon name="edit" size={20} color="#fff" />
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deletePanel(item.id)}>
                <Icon name="trash" size={20} color="#fff" />
                <Text style={styles.buttonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default SolarPanelManagementScreen;
