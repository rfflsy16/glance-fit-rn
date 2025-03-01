import { View, Text, StyleSheet } from "react-native";

export default function Instruction() {
    return (
        <View style={styles.container}>
            <Text>Instruction</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    }
})