import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './appStyles';
import axios from 'axios';
import {users} from '../App';


const userProfile = ({history}) => {
  const logOut = () => {
    try{
      history.push('/');
    }
    
    catch (error) {
      console.log(error);
    }
  }


  return(
    <View>
      <Text style={styles.header}>
        Welcome to your Profile Page!
      </Text>

      <View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress= {logOut}>
          <Text> Log Out </Text>
        </TouchableOpacity>
      </View>

    </View>
  )
};

export default userProfile;