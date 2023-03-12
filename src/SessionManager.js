import AsyncStorage from '@react-native-async-storage/async-storage'

const session_name = 'session'

export const CreateSession = async (data) => {
  await AsyncStorage.setItem(session_name, JSON.stringify(data))
}

export const GetSession = async () => {
  let result = await AsyncStorage.getItem(session_name)
  return result
}

export const DeleteSession = async () => {
    AsyncStorage.clear()
}