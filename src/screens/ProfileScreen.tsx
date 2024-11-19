import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const initialName = 'Matheus Oliveira';
  const initialEmail = 'matheus@gmail.com';

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [newName, setNewName] = useState(initialName);
  const [newEmail, setNewEmail] = useState(initialEmail);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('profileName');
        const storedEmail = await AsyncStorage.getItem('profileEmail');

        if (storedName !== null) {
          setName(storedName);
          setNewName(storedName);
        }
        if (storedEmail !== null) {
          setEmail(storedEmail);
          setNewEmail(storedEmail);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    loadProfileData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('profileName', newName);
      await AsyncStorage.setItem('profileEmail', newEmail);
      setName(newName);
      setEmail(newEmail);
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.profileData}>{name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Mudar Nome"
        value={newName}
        onChangeText={setNewName}
      />
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.profileData}>{email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Mudar Email"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
      />
      <Button title="Salvar" onPress={handleSaveProfile} />
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  profileData: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 15,
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});


export default ProfileScreen;
