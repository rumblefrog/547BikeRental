import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './appStyles';


const welcomePage = ({history}) => {
  
  return (
  <View>
    <Text style={styles.header}>
      Welcome to RFID Bike Rental App{"\n"}
    </Text>


    <View>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress = {() => history.push('/userLogin')}>
        <Text> Login to an Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonStyle} 
        onPress = {() => history.push('/registerAcc')}> 
        <Text> Create an Account </Text>
      </TouchableOpacity>
      
    </View>
    
  </View>
  );
}

export default welcomePage;