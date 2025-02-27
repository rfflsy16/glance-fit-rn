import { createStackNavigator } from '@react-navigation/stack';
import MyTabs from './BottomTab';
import Settings from '@/screens/Profile/Settings';
import Wallet from '@/screens/Profile/Wallet';
import Chat from '@/screens/Community/Chat';
import AuthStack from './Auth';
import NameInput from '@/screens/Auth/NameInput';
import ReferralInput from '@/screens/Auth/ReferralInput';
import ProgramStack from './Program';
export type RootStackParamList = {
    BottomTab: undefined;
    Settings: undefined;
    Wallet: undefined;
    Chat: undefined;
    Auth: undefined;
    NameInput: undefined;
    ReferralInput: undefined;
    ProgramStack: {
        screen: string;
        params: {
            id: number;
        };
    } | undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName='BottomTab'
            screenOptions={{
                headerShown: false,
                // animation: 'scale_from_center'
            }}
        >
            <Stack.Screen name="BottomTab" component={MyTabs} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Auth" component={AuthStack} options={{ animation: 'scale_from_center' }} />
            <Stack.Screen name="NameInput" component={NameInput} options={{ animation: 'slide_from_right' }}/>
            <Stack.Screen name="ReferralInput" component={ReferralInput} options={{ animation: 'slide_from_right' }}/>
            <Stack.Screen name="ProgramStack" component={ProgramStack} options={{ animation: 'slide_from_right', headerShown: false }} />
						
        </Stack.Navigator>
    );
}
