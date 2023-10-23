import AsyncStorage from '@react-native-async-storage/async-storage'

const session_name = 'session'

export const CreateSession = async (data) => {
  await AsyncStorage.setItem(session_name, JSON.stringify(data))
  console.log('Session created: ' + JSON.stringify(data))
}

export const GetSession = async () => {
  let result = await AsyncStorage.getItem(session_name)
  return result
}

export const SetSession = async (data) => {
  let session = {}
  GetSession().then(response => {
    session = JSON.parse(response)
    session.user.photo = data
  }).catch((error) => console.log(error))
  
  await AsyncStorage.setItem(session_name, JSON.stringify(session))
}

export const DeleteSession = async () => {
    AsyncStorage.clear()
}