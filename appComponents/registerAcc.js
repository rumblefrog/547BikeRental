import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from './appStyles';
import axios from 'axios';
import {users} from '../App';



const accMake = ({history}) => {
  const [username, onChangeU] = React.useState('');
  const [password, onChangeP] = React.useState('');

  const registerAcc = () => {
    try{
      if(/^[a-zA-Z0-9]{3,20}$/.test(username)){
        if(/^[a-zA-Z0-9!@#$%^&*]{8,30}$/.test(password)){
          if(!users.hasOwnProperty(username)){
            users[username] = password;
            alert('User Successfully Created');
            history.push('/');
          }
          else{
            throw new Error('User already exists');
          }
        }
        else{
          throw new Error('Invalid password input');
        }
      }
      else{
        throw new Error('Invalid username');
      }
    }

    catch (error){
      alert(error);
    }
  }


  return( 
    <View>
        <Text style={styles.header}>
          Bike Rental Account Registration
        </Text>

        <View>
          <TextInput
            style={styles.inputBar}
            placeholder={'Choose Username'}
            placeholderTextColor="gray"
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText = {(text) => onChangeU(text)}
            value = {username}
          />

          <TextInput
            style={styles.inputBar}
            placeholder={'Create Password'}
            placeholderTextColor="gray"
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            secureTextEntry
            onChangeText = {(text) => onChangeP(text)}
            value = {password}
          />

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress = {registerAcc}>
            <Text> Register Account </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonStyle} 
            onPress = {() => history.push("/")}>
            <Text> Back to Home </Text> 
          </TouchableOpacity>
        </View>
      
    </View>
  )
};

export default accMake;