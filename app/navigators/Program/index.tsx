import { createStackNavigator } from "@react-navigation/stack";
import Detail from "@/screens/Program/Detail";

export type ProgramStackParamList = {
    Detail: {
        id: number;
    };
};

const Stack = createStackNavigator<ProgramStackParamList>();

export default function ProgramStack() {
    return (
        <Stack.Navigator
            initialRouteName="Detail"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
    );
}