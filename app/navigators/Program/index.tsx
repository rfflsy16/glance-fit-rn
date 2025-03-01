import { createStackNavigator } from "@react-navigation/stack";
import Detail from "@/screens/Program/Detail";
import Instruction from "@/screens/Program/Detail/Instruction";
export type ProgramStackParamList = {
    Detail: {
        id: number;
    };
    Instruction: {
        programId: number;
        weekId: number;
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
            <Stack.Screen name="Instruction" component={Instruction} />
        </Stack.Navigator>
    );
}