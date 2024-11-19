import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SolarPanelScreen = () => {
  const [energyGenerated, setEnergyGenerated] = useState('');
  const [energyConsumed, setEnergyConsumed] = useState('');
  const [energyBalance, setEnergyBalance] = useState(0);

  const [storedGenerated, setStoredGenerated] = useState('');
  const [storedConsumed, setStoredConsumed] = useState('');
  const [storedBalance, setStoredBalance] = useState(0);

  useEffect(() => {
    const loadSolarData = async () => {
      try {
        const savedGenerated = await AsyncStorage.getItem('solarGenerated');
        const savedConsumed = await AsyncStorage.getItem('solarConsumed');
        const savedBalance = await AsyncStorage.getItem('solarBalance');

        if (savedGenerated !== null) setStoredGenerated(savedGenerated);
        if (savedConsumed !== null) setStoredConsumed(savedConsumed);
        if (savedBalance !== null) setStoredBalance(parseFloat(savedBalance));
      } catch (error) {
        console.error('Erro ao carregar dados do painel solar:', error);
      }
    };

    loadSolarData();
  }, []);

  const handleCalculateAndSave = async () => {
    try {
      const generated = parseFloat(energyGenerated);
      const consumed = parseFloat(energyConsumed);

      if (isNaN(generated) || isNaN(consumed)) {
        alert('Por favor, insira valores válidos.');
        return;
      }

      const balance = generated - consumed;

      await AsyncStorage.setItem('solarGenerated', energyGenerated);
      await AsyncStorage.setItem('solarConsumed', energyConsumed);
      await AsyncStorage.setItem('solarBalance', balance.toString());

      setStoredGenerated(energyGenerated);
      setStoredConsumed(energyConsumed);
      setStoredBalance(balance);

      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados do painel solar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Energia Gerada (kWh):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 100"
        keyboardType="numeric"
        value={energyGenerated}
        onChangeText={setEnergyGenerated}
      />

      <Text style={styles.label}>Energia Consumida (kWh):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 80"
        keyboardType="numeric"
        value={energyConsumed}
        onChangeText={setEnergyConsumed}
      />

      <Button title="Calcular e Salvar" onPress={handleCalculateAndSave} />

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Últimos Dados Salvos:</Text>
        <Text style={styles.resultText}>Energia Gerada: {storedGenerated} kWh</Text>
        <Text style={styles.resultText}>Energia Consumida: {storedConsumed} kWh</Text>
        <Text style={styles.resultText}>Saldo Energético: {storedBalance} kWh</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2f2f2f',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
});


export default SolarPanelScreen;
