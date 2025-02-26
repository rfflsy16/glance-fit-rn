import { createStackNavigator } from "@react-navigation/stack";
import Verification from "@/screens/Auth/Login/Phone/Verification";
import Phone from "@/screens/Auth/Login/Phone";

type PhoneStackParamList = {
    Phone: undefined;
    Verification: { phoneNumber: string };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends PhoneStackParamList {}
    }
}

const Stack = createStackNavigator();
export default function PhoneStack() {
    return (
        <Stack.Navigator
        initialRouteName='Phone'
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
        }}
    >
        <Stack.Screen name="Phone" component={Phone} />
        <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
    )
}