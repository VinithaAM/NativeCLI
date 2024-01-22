import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import {ScreenType} from './StackNavigation';

type Proptype = NativeStackScreenProps<ScreenType, 'OTPPage'>;
function OtpScreen(prop: Proptype) {
  const {navigation} = prop;
  const onHandleresend = () => {};
  const onhandleSubmit = () => {
    navigation.navigate('ChangePassword');
  };
  return (
    <View style={style.container}>
      <Text style={style.textTitle}> Please Enter One time Password</Text>
      <OTPTextView></OTPTextView>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={[style.buttonLogin, style.customButton]}
          onPress={onhandleSubmit}>
          <Text style={style.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: '#103a9e',
            fontSize: 18,
            marginTop: 40,
            marginLeft: 10,
          }}
          onPress={onHandleresend}>
          Resend OTP?
        </Text>
      </View>
    </View>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flex: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#080707',
    width,
    height: 40,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
  },
  inputTitle: {
    alignSelf: 'flex-start',
    paddingLeft: 25,
    marginBottom: 5,
    opacity: 0.5,
    color: '#080707',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },

  buttonCancel: {
    backgroundColor: '#147EFB',
    textAlign: 'center',
  },
  customButton: {
    padding: 15,
    borderRadius: 5,
    marginLeft: 1,
    marginRight: 8,
    borderColor: '#0e5ced',
  },
  buttonLogin: {
    backgroundColor: '#077a0b',
    textAlign: 'center',
    width: '20%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    margin: 30,
  },

  textTitle: {
    color: '#3246a8',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default OtpScreen;
