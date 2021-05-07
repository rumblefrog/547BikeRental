import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from './appStyles';
import axios from 'axios';
import {users} from '../App';

const userLogin = ({history}) => {
  const [username, onChangeUserN] = React.useState('');
  const [password, onChangeP] = React.useState('');

  const login = () => {
    try{
      if(/^[a-zA-Z0-9]{3,20}$/.test(username)){
        if(/^[a-zA-Z0-9!@#$%^&*]{8,30}$/.test(password)){
            if(users.hasOwnProperty(username) & users[username] == password){
                history.push('/userProfile');
            }
            else{
                throw new Error('Invalid username or password');
            }
        }
        else{
          throw new Error('Invalid Password Input');
        } 
      }
      else{
        throw new Error('Invalid username input');
      }
    }

    catch (error) {
      alert(error);
    }
  }


  return (
    <View>
        <Text style={styles.header}>
          Welcome to NoID Member Login!
        </Text>
        
        <View>
          <TextInput
            style={styles.inputBar}
            placeholder={'Username'}
            placeholderTextColor="gray"
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={(text) => onChangeUserN(text)}
            value={username}
          />

          <TextInput
            style={styles.inputBar}
            placeholder={'Password'}
            placeholderTextColor="gray"
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={(text) => onChangeP(text)}
            value={password}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress = {login}>
            <Text> Login </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonStyle} 
            onPress = {() => history.push("/")}> 
            <Text> Back to Home </Text>
          </TouchableOpacity>
        </View>

    </View>
  );
}

export default userLogin;