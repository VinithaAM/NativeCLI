import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import JailMonkey from 'jail-monkey';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenType} from './StackNavigation';

interface RowProps {
  label: string;
  value: boolean | undefined;
}
type Proptype = NativeStackScreenProps<ScreenType, 'samplePage'>;
function Sample(prop: Proptype) {
  const {navigation} = prop;
  const [isDevelopmentSettingsMode, setIsDevelopmentSettingsMode] =
    useState<boolean>(false);
  const [isDebuggedMode, setIsDebuggedMode] = useState<boolean>();
  const [isJailBreak, setJailBreak] = useState(false);
  const [canMockLocation, setCanMockLocation] = useState(false);
  const [trustFall, settrustFall] = useState(false);
  const [hookDetected, sethookDetected] = useState(false);
  const [isOnExternalStorage, setisOnExternalStorage] = useState(false);
  const [AdbEnabled, setAdbEnabled] = useState(false);
  const [ispageLoad, setpageLoad] = useState(false);
  useEffect(() => {
    IsCheckJailBreak();
    InitialLoad();
  }, []);
  const IsCheckJailBreak = () => {
    setJailBreak(JailMonkey.isJailBroken());
    setCanMockLocation(JailMonkey.canMockLocation());
    setAdbEnabled(JailMonkey.AdbEnabled());
    sethookDetected(JailMonkey.hookDetected());
    setisOnExternalStorage(JailMonkey.isOnExternalStorage());
    settrustFall(JailMonkey.trustFall());
    JailMonkey.isDevelopmentSettingsMode()
      .then(value => {
        setIsDevelopmentSettingsMode(value);
      })
      .catch(console.warn);
    JailMonkey.isDebuggedMode()
      .then(value => {
        setIsDebuggedMode(value);
      })
      .catch(console.warn);
  };
  const InitialLoad = () => {
    if (isJailBreak) {
      setpageLoad(true);
    } else {
      navigation.navigate('LoginPage');
    }
  };
  // const Row: React.FC<RowProps> = ({label, value}) => {
  //   return (
  //     <View
  //       style={style.row}
  //       accessibilityLabel={`${label}: ${value?.toString() ?? 'unknown'}`}>
  //       <Text style={style.label}>{label}:</Text>
  //       <Text style={style.value}>{value?.toString() ?? 'unknown'}</Text>
  //     </View>
  //   );
  // };
  return (
    <>
      <View>
        {ispageLoad && (
          <View style={style.container}>
            <Text> Your App is Hacked Someone</Text>
          </View>
        )}
      </View>
      <View style={style.container}>
        {isJailBreak && <Text> Your App is Hacked Someone</Text>}
        <Text>Safe</Text>
        {/* <Pressable style={style.titleContainer}></Pressable> */}
        {/* <Row label="isJailBroken" value={isJailBreak} />
      <Row label="canMockLocation" value={canMockLocation} />
      <Row label="trustFall" value={trustFall} />
      <Row label="isDebuggedMode" value={isDebuggedMode} />
      <Text style={style.title}>Android</Text>
      <Text style={style.note}>
        These APIs will always return false on iOS.
      </Text>
      <Row label="hookDetected" value={hookDetected} />
      <Row label="isOnExternalStorage" value={isOnExternalStorage} />
      <Row label="AdbEnabled" value={AdbEnabled} />
      <Row
        label="isDevelopmentSettingsMode"
        value={isDevelopmentSettingsMode}
      /> */}
      </View>
    </>
  );
}

export default Sample;
const style = StyleSheet.create({
  container: {
    backgroundColor: '#E3EDFB',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0F5683',
  },
  titleContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 16,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#444',
    fontWeight: '700',
    marginRight: 5,
  },
  value: {
    fontSize: 16,
    color: '#444',
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
  },
  note: {
    fontSize: 11,
    color: '#888',
    marginBottom: 10,
  },
});
