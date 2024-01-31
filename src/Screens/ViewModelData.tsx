import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Platform,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {useRoute} from '@react-navigation/native';
import {ScreenType} from './StackNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getHistoryCorrection} from '../Services/CommonService';
import {connectToDatabase, getDetails} from '../Services/Database';
import {ListItem} from 'react-native-elements';

type typeprop = NativeStackScreenProps<ScreenType, 'ViewModel'>;
function ViewModelData(prop: typeprop) {
  const {navigation} = prop;
  const [userDetails, setUserDetails] = useState([]);
  const [base64stringImage, setbase64string] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      getUserdetails();
    }, 3000);
  }, [userDetails]);
  const getUserdetails = async () => {
    const db = await connectToDatabase();
    try {
      await getDetails(db).then((result: any) => {
        setUserDetails(result);
        setLoading(true);
        const filter = userDetails.filter(x => x.id == 1)[0].Profilepic;
        // console.log('User', filter);
      });
      // const textEncoder = new TextEncoder();
      //const byteArray = textEncoder.encode(filter.Profilepic);
      const filter = userDetails.filter(x => x.id == 1)[0].Profilepic;
      // const imgByte: number[] = filter.Profilepic.replace('"');
      // console.log('User', filter);
      // const charArray = Array.from(imgByte, (byte: any) =>
      //   String.fromCharCode(byte),
      // );

      // const imagesavepath = '../src/assets/image.jpg';
      // const base64String = encode(charArray.join(''));
    } catch {
      (error: any) => console.log(error);
    }
  };
  const hideEditModal = () => {
    setEditModalVisible(false);
  };
  const onHandleForgetPassword = (e: any) => {
    //console.log('profile', e);
    setEditModalVisible(true);
    setbase64string(e.Profilepic);
    // <Image
    //   style={{height: 100, width: 150, margin: 10}}
    //   source={{uri: `data:image/png;base64,${x.Profilepic}`}}></Image>;
    //navigation.navigate('ForgetPassword');
  };
  function LoadingAnimation() {
    return (
      <View style={style.indicatorWrapper}>
        <ActivityIndicator size="large" color={'#999999'} />
        <Text style={style.indicatorText}>Loading </Text>
      </View>
    );
  }
  return (
    <View style={style.viewContainer}>
      {loading ? (
        <View>
          {userDetails.length > 0 && (
            <View style={style.innerContainer}>
              {userDetails.map((x, index) => (
                <>
                  <View style={style.textContainer}>
                    <Text
                      style={{
                        fontSize: 12,
                        margin: 5,
                        color: '#076cf0',
                        fontWeight: 'bold',
                      }}
                      key={x.id}>
                      {'Name: '}
                    </Text>
                    <Text style={{fontSize: 12, margin: 5, fontWeight: 'bold'}}>
                      {x.Name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#076cf0',
                        margin: 5,
                        fontWeight: 'bold',
                      }}>
                      {'Username: '}
                    </Text>
                    <Text>{x.UserName}</Text>
                  </View>
                  <View style={style.textContainer}></View>
                  <Text
                    style={{color: '#1f0a0c', fontSize: 15, margin: 5}}
                    onPress={() => onHandleForgetPassword(x)}>
                    Show Image
                  </Text>
                </>
              ))}
            </View>
          )}
        </View>
      ) : (
        <LoadingAnimation />
      )}
      <Modal animationIn="slideInUp" isVisible={editModalVisible}>
        <View style={style.modalView}>
          <Image
            style={{height: 300, width: 300, margin: 10}}
            source={{
              uri: `data:image/png;base64,${base64stringImage}`,
            }}></Image>
          <Pressable style={style.buttonClear} onPress={hideEditModal}>
            <Text style={{color: '#fff'}}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
const style = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 1,
  },
  List: {
    marginTop: 8,
  },
  innerContainer: {
    flexGrow: 1,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  gridItem: {
    flex: 1,
    //margin: 10,
    height: 45,
    borderRadius: 8,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    marginTop: 4,
    overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
  },
  textContainer: {
    flexDirection: 'row',
    //marginLeft: 10,
  },
  modalView: {
    flexGrow: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
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
    color: 'white',
  },
  buttonDelete: {
    backgroundColor: 'red',
    textAlign: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
    color: 'white',
    padding: 10,
  },
  indicatorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
  },
});
export default ViewModelData;
