import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {Icon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function ChangePassword() {
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isPasswordEmpty, setPasswordEmpty] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfPasswordSecure, setIsConfPasswordSecure] = useState(true);
  function handleChangepassword(event: any) {
    setPassword(event);
    validatePassword(password);
    setPasswordEmpty(false);
    setPasswordsMatch(event === confirmPassword);
  }
  function handleChangeconfirmPassword(event: any) {
    setconfirmPassword(event);
    setPasswordsMatch(password === event);
  }
  const validatePassword = (password: any) => {
    // Password policies
    const minLength = 8;
    const maxLength = 20;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    // Check against policies
    if (
      password.length <= minLength ||
      password.length >= maxLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      setValidationMessage(
        'Password must be between 8 and 20 characters and uppercase and lowercase letters and at least one number and at least one special character ',
      );
    }
    //else if (!hasUppercase || !hasLowercase) {
    //   setValidationMessage(
    //     'Password must contain both uppercase and lowercase letters',
    //   );
    // } else if (!hasNumber) {
    //   setValidationMessage('Password must contain at least one number');
    // } else if (!hasSpecialChar) {
    //   setValidationMessage(
    //     'Password must contain at least one special character',
    //   );
    // }
    else {
      setValidationMessage('Password is valid');
    }
  };
  const onhandleSave = () => {};
  const onHandleClear = () => {
    setPassword('');
    setconfirmPassword('');
  };
  return (
    <View style={style.container}>
      <Text style={style.textTitle}>Change Password</Text>
      <Text style={style.inputTitle}>Password</Text>
      <View>
        <TextInput
          placeholder="Enter the Password"
          style={[
            style.textInput,
            {borderColor: isPasswordEmpty ? 'red' : 'black'},
          ]}
          value={password}
          secureTextEntry={isPasswordSecure}
          maxLength={20}
          onChangeText={handleChangepassword}
          onKeyPress={validatePassword}></TextInput>
        <Icon
          name={isPasswordSecure ? 'facebook' : 'eye'}
          size={20}
          color="black"
          style={{position: 'absolute', top: 8, right: 10}}
          onPress={() =>
            isPasswordSecure
              ? setIsPasswordSecure(false)
              : setIsPasswordSecure(true)
          }
        />
        {validationMessage !== '' &&
          validationMessage !== 'Password is valid' && (
            <View style={style.errorMessage}>
              <Text style={style.errorText}>{validationMessage}</Text>
            </View>
          )}
      </View>

      <Text style={style.inputTitle}>Confirm Password</Text>
      <View>
        <TextInput
          placeholder="Enter the confirmPassword"
          style={style.textInput}
          value={confirmPassword}
          secureTextEntry={isConfPasswordSecure}
          maxLength={30}
          onChangeText={handleChangeconfirmPassword}></TextInput>
        <Icon
          name={isConfPasswordSecure ? 'eye-off' : 'eye'}
          size={24}
          color="black"
          style={{position: 'absolute', top: 8, right: 10}}
          onPress={() =>
            isConfPasswordSecure
              ? setIsConfPasswordSecure(false)
              : setIsConfPasswordSecure(true)
          }
        />
        {!passwordsMatch && (
          <View style={style.errorMessage}>
            <Text style={style.errorText}>Password Doesn't Match</Text>
          </View>
        )}
      </View>
      <View style={style.styleView}>
        <TouchableOpacity
          style={[style.buttonLogin, style.customButton]}
          onPress={onhandleSave}>
          <Text style={{color: '#fff'}}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[style.customButton, style.buttonClear]}
          onPress={onHandleClear}>
          <Text style={{color: '#fff'}}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textInput: {
    borderWidth: 2,
    borderColor: 'black',
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
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 15,
    marginRight: 100,
  },
  styleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  customButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 4,
    marginRight: 4,
    borderColor: 'blue',
  },
  buttonLogin: {
    backgroundColor: 'green',
    textAlign: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
  },
  textTitle: {
    color: 'blue',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 20,
    textAlign: 'center',
  },

  errorMessage: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  },
});
export default ChangePassword;
