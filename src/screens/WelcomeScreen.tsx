import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-Vindo!</Text>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('Perfil')}
      >
        <Text style={styles.buttonText}>Perfil</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('SolarPanelScreen')}
      >
        <Text style={styles.buttonText}>Consumo Painel Solar</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('SolarPanelManagementScreen')}
      >
        <Text style={styles.buttonText}>Cadastrar Painel Solar</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('InvestmentCalculatorScreen')}
      >
        <Text style={styles.buttonText}>Investimentos</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});


export default WelcomeScreen;
