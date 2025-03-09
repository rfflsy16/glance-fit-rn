import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Pembayaran from '@/screens/Profile/Wallet/Pembayaran';
import DetailPembayaran from '@/screens/Profile/Wallet/DetailPembayaran';
import RincianTransaksi from '@/screens/Profile/Wallet/RincianTransaksi';

export type PaymentStackParamList = {
    Pembayaran: {
        amount: number;
        price: string;
    };
    DetailPembayaran: {
        amount: number;
        price: string;
        transactionId?: string;
    };
    RincianTransaksi: {
        transactionId: string;
        amount: number;
        price: string;
        status: 'pending' | 'success' | 'failed';
        date: string;
        time: string;
    };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends PaymentStackParamList {}
    }
}

const Stack = createStackNavigator<PaymentStackParamList>();

export default function PaymentStack() {
    return (
        <Stack.Navigator
            initialRouteName='Pembayaran'
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="Pembayaran" component={Pembayaran} />
            <Stack.Screen name="DetailPembayaran" component={DetailPembayaran} />
            <Stack.Screen name="RincianTransaksi" component={RincianTransaksi} />
        </Stack.Navigator>
    );
}