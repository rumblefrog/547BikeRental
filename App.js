import React from 'react';

import styles from './appComponents/appStyles';
import welcomePage from './appComponents/welcomePage';
import accMake from './appComponents/registerAcc';
import userLogin from './appComponents/loginPage';
import userProfile from './appComponents/profilePage';

import 
{
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

import 
{ 
  NativeRouter, 
  Route, 
  Switch 
} from 'react-router-native';

export const users = {
  testuser: 'testtest'
}




const App = () => {
  return (
  <NativeRouter>
    <View style={styles.container}>
      <Switch>
        <Route exact path="/" component={welcomePage} />
        <Route path="/registerAcc" component={accMake} />
        <Route path="/userLogin" component={userLogin} />
        <Route path="/userProfile" component={userProfile} />
      </Switch>
    </View>
  </NativeRouter>
  );
}

export default App;