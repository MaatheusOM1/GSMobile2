import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InvestmentCalculatorScreen = () => {
  const [investment, setInvestment] = useState('');
  const [time, setTime] = useState('');
  const [energyUsed, setEnergyUsed] = useState('');
  const [returnOnInvestment, setReturnOnInvestment] = useState<number | null>(null);

  const [storedROI, setStoredROI] = useState<number | null>(null);

  useEffect(() => {
    const loadStoredROI = async () => {
      try {
        const savedROI = await AsyncStorage.getItem('lastROI');
        if (savedROI !== null) {
          setStoredROI(parseFloat(savedROI));
        }
      } catch (error) {
        console.error('Erro ao carregar o último ROI:', error);
      }
    };
    loadStoredROI();
  }, []);

  const calculateROI = () => {
    if (!investment || !time || !energyUsed) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
      return;
    }

    const investedAmount = parseFloat(investment);
    const timeInYears = parseFloat(time);
    const energyConsumed = parseFloat(energyUsed);

    if (isNaN(investedAmount) || isNaN(timeInYears) || isNaN(energyConsumed)) {
      Alert.alert('Erro', 'Por favor, insira valores válidos!');
      return;
    }

    const savingsPerKWh = 0.80;
    const annualSavings = savingsPerKWh * energyConsumed;
    const roi = (annualSavings * timeInYears) / investedAmount;

    setReturnOnInvestment(roi);

    AsyncStorage.setItem('lastROI', roi.toString());
    setStoredROI(roi);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cálculo de Retorno do Investimento em Painéis Solares</Text>

      <TextInput
        style={styles.input}
        placeholder="Valor Investido (R$)"
        keyboardType="numeric"
        value={investment}
        onChangeText={setInvestment}
      />
      <TextInput
        style={styles.input}
        placeholder="Tempo de Uso (anos)"
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Energia Gasta (kWh)"
        keyboardType="numeric"
        value={energyUsed}
        onChangeText={setEnergyUsed}
      />

      <Button title="Calcular ROI" onPress={calculateROI} />

      {returnOnInvestment !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Retorno sobre o Investimento (ROI):</Text>
          <Text style={styles.resultText}>
            {returnOnInvestment.toFixed(2)} % do valor investido
          </Text>
        </View>
      )}

      {storedROI !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Último ROI Calculado:</Text>
          <Text style={styles.resultText}>{storedROI.toFixed(2)} % do valor investido</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f4f4f9',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 30,
      textAlign: 'center',
      color: '#333',
      textTransform: 'uppercase',
    },
    input: {
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1.5,
      marginBottom: 20,
      paddingHorizontal: 15,
      borderRadius: 10,
      backgroundColor: '#fff',
      fontSize: 16,
      color: '#333',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    resultContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    resultLabel: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 12,
      color: '#555',
    },
    resultText: {
      fontSize: 18,
      fontWeight: '400',
      color: '#333',
    },
  });
  

export default InvestmentCalculatorScreen;
