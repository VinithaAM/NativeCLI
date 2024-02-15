import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";
import {ScreenType} from './StackNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {detailsBySearch, getHistoryCorrection, refreshToken} from '../Services/CommonService';
import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Accordions from './Accordions';
import {connectToDatabase, getCorrectionDetails} from '../Services/Database';

type Proptype = NativeStackScreenProps<ScreenType, 'FlatListPage'>;
function DataCorrectionListPage(prop: Proptype) {
  // console.log("data", prop);
  const {navigation} = prop;
  const [columns, setColumns] = useState(1);
  const [ListData, setListData] = useState([]);
  const[searchList,setSearchList]=useState([])
  const getHistoryData = async () => {
    try {
      // const db = await connectToDatabase();
      // getCorrectionDetails(db).then((result: any) => {
      //   setListData(result);
      // });
    
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
   // handletoken()
  };
      const [userId,setUserId]=useState(0);
  useEffect(async () => {
    const Userdetails= await AsyncStorage.getItem('LoginResponse');
    const id=JSON.parse(Userdetails).id
    console.log("id",id)
    setUserId(id)
    setTimeout(() => {
      getHistoryData();
     
    }, 5000);
  }, []);
  useFocusEffect(
    useCallback(() => {
      getHistoryData();
    }, []),
  );
  const handletoken = async () => {
  
    refreshToken(userId).catch(error=>console.log("Error in Token",error))
    const intervalId = setInterval(refreshToken, 300000);
    console.log("intervalId",intervalId)
     clearInterval(intervalId);
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
    setSearchList([])
    setSearchtext('')
    navigation.navigate('AddNew');
    
  }

  const onHandleSignout = () => {
    AsyncStorage.removeItem("LoginResponse");
    navigation.navigate('LoginPage');
  };
  const [searchtext,setSearchtext]=useState("")
  const [spinnerVisibility,setspinnerVisiblity]=useState(true)
  const onHandleSearch=(e:any)=>{
    setSearchList([])
    setSearchtext(e)
    setspinnerVisiblity(true)
    console.log(e)
    setListData([])
    try {
      detailsBySearch(searchtext)
        .then((result: any) => {
          if (result.data.status == 'Success') {
            setSearchList(result.data.data);
            // console.log(result.data.data)
            setspinnerVisiblity(true)
          }
        })
        .catch((error: any) => {
          console.log('Error occurred', error);
          navigation.navigate('LoginPage');
        });
    } catch (error) {
      console.log('Error occured', error);
    }
    
  }
  const onClear=async ()=>{
    setSearchList([])
    setSearchtext('')
   getHistoryData()
  }
  return (
    <>
    <View style={{flexDirection:"row",width:width}}>
      <SearchBar 
      //  backgroundColor="#353d5e"
       value={searchtext}
       placeholder='Search here'
       onChangeText={onHandleSearch}
       onClearPress={onClear}
      ></SearchBar>
    <Pressable style={style.newButton} onPress={handlePress}>
        <Text style={{color: '#fff'}}>Add New</Text>
      </Pressable>

    </View>
     
      <View style={style.container}>
        <FlatList
          style={style.List}
          data={(searchList.length>0)?searchList:ListData}
          keyExtractor={keyExtractor}
          renderItem={renderItems}
          numColumns={columns}
          key={columns}></FlatList>
      </View>
      <Pressable
        style={[style.customButton, style.signoutButton]}
        onPress={onHandleSignout}>
        <Text style={{color: '#fff'}}>SignOut</Text>
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
    padding: 10,
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
