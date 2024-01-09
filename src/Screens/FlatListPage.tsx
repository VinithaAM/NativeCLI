import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import {ScreenType} from './StackNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getHistoryCorrection} from '../Services/CommonService';
import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Accordions from './Accordions';

type Proptype = NativeStackScreenProps<ScreenType, 'FlatListPage'>;
function DataCorrectionListPage(prop: Proptype) {
  // console.log("data", prop);
  const {navigation} = prop;
  const [columns, setColumns] = useState(1);
  const [ListData, setListData] = useState([]);
  const getHistoryData = () => {
    try {
      getHistoryCorrection()
        .then((result: any) => {
          if (result.data.status == 'Success') {
            setListData(result.data.data);
          }
        })
        .catch((error: any) => {
          console.log('Error occurred', error);
          navigation.navigate('LoginPage');
        });
    } catch (error) {
      console.log('Error occured', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handletoken();
    }, 5000);
  }, []);
  useFocusEffect(
    useCallback(() => {
      getHistoryData();
    }, []),
  );
  const handletoken = async () => {
    getHistoryData();
  };
  function renderItems(e: any) {
    return (
      <>
        <Accordions title={e.item}></Accordions>
      </>
    );
  }
  const keyExtractor = (item: {id: number}) => {
    return item.id.toString();
  };
  function handlePress() {
    navigation.navigate('AddNew');
  }

  const onHandleSignout = () => {
    AsyncStorage.clear();
    navigation.navigate('LoginPage');
  };

  return (
    <>
      <Pressable style={style.newButton} onPress={handlePress}>
        <Text>Add New</Text>
      </Pressable>
      <View style={style.container}>
        <FlatList
          style={style.List}
          data={ListData}
          keyExtractor={keyExtractor}
          renderItem={renderItems}
          numColumns={columns}
          key={columns}></FlatList>
      </View>
      <Pressable
        style={[style.customButton, style.signoutButton]}
        onPress={onHandleSignout}>
        <Text>SignOut</Text>
      </Pressable>
    </>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  buttonPressed: {
    opacity: 1,
  },
  List: {
    marginTop: 0,
    marginBottom: 0,
  },

  newButton: {
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 10,
    alignSelf: 'flex-end',
    margin: 10,
  },
  signoutButton: {
    padding: 5,
    backgroundColor: 'orange',
    borderRadius: 5,
    alignSelf: 'flex-end',
    margin: 10,
  },
  customButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 4,
    marginRight: 4,
    borderColor: 'blue',
  },
});
export default DataCorrectionListPage;
