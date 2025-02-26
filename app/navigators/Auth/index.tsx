import { createStackNavigator } from '@react-navigation/stack';
import Login from '@/screens/Auth/Login';
import Google from '@/screens/Auth/Login/Google';
import PhoneStack from './Phone';


export type AuthStackParamList = {
    Login: undefined;
    Google: undefined;
    PhoneStack: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends AuthStackParamList {}
    }
}

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName='Login'
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Google" component={Google} />
            <Stack.Screen name="PhoneStack" component={PhoneStack} />
        </Stack.Navigator>
    );
}