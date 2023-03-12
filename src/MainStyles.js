import { StyleSheet } from "react-native"
import { StatusBar } from 'expo-status-bar';

export const primaryColor = '#10ac84'
export const bgColor = '#ecf0f1'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColor
    },
    centralizeContent: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerCard: {
        minHeight: '25%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: primaryColor,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    headerCardTitle: {
        color: '#fff',
        fontSize: 30
    },
    headerCardSubtitle: {
        color: '#fff',
        fontSize: 20
    },
    headerCardImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: 50,
    },
    card: {
        width: '85%',
        minHeight: '20%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginTop: -20,
        borderRadius: 10,
        paddingVertical: 30,
        paddingHorizontal: 25
    },
    cardLabel: {
        color: primaryColor,
        fontSize: 16
    },
    cardButton: {
        backgroundColor: primaryColor,
        width: '60%',
        paddingVertical: 15,
        alignSelf: 'center',
        borderRadius: 100
    },
    cardButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textInput: {
        borderBottomWidth: 1,
        marginBottom: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#ccc',
        fontSize: 16
    }
})