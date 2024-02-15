// import { useNavigation } from "@react-navigation/native";
import {TextInput, TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Navigation from './Navigatior';
import {ScreenType} from './StackNavigation';

// type Proptype = NativeStackScreenProps<ScreenType, 'WelcomePage'>;

function WelcomePage(prop: any) {
  const {navigation} = prop;

  const onHadleSignup = () => {
    navigation.navigate('RegistrationPage');
  };
  const onHandleLoginPage = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <View style={style.container}>
      <View style={style.content}>
        <Text style={style.title}>Welcome to Awesome App!</Text>
        <Text style={style.desc}>
          Please log in to continue to the awesommess !!
        </Text>
      </View>

      <View style={style.buttonsContainer}>
        <TouchableOpacity
          style={[style.button, style.login]}
          onPress={onHandleLoginPage}>
          <Text style={style.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    backgroundColor: '#fff',
  },
  content: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 39,
  },
  desc: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
  },
  buttonsContainer: {
    flex: 4,
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-around',
  },
  button: {
    width: '48%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  login: {
    backgroundColor: '#4267B2',
  },
  signup: {
    backgroundColor: 'green',
  },
});
export default WelcomePage;
