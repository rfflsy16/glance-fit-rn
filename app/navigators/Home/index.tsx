// import { createStackNavigator } from '@react-navigation/stack';
// import Distance from '@/screens/Home/Distance';
// import CaloriesIn from '@/screens/Home/CaloriesIn';
// import CaloriesOut from '@/screens/Home/CaloriesOut';
// import Activity from '@/screens/Home/Activity';
// import ChallengeDetail from '@/screens/Home/Challenge/index';
// import Steps from '@/screens/Home/Steps';


// type HomeStackParamList = {
//     Distance: undefined;
//     CaloriesIn: undefined;
//     CaloriesOut: undefined;
//     Activity: undefined;
//     ChallengeDetail: undefined;
//     Steps: undefined;
// }

// declare global {
//     namespace ReactNavigation {
//         interface RootParamList extends HomeStackParamList {}
//     }
// }


// const Stack = createStackNavigator<HomeStackParamList>();

// export default function HomeStack() {
//     return (
//         <Stack.Navigator
//         initialRouteName='Distance'
//         screenOptions={{
//             headerShown: false,
//             animation: 'slide_from_right'
//         }}
//         >
//             <Stack.Screen name="Distance" component={Distance} />
//             <Stack.Screen name="CaloriesIn" component={CaloriesIn} />
//             <Stack.Screen name="CaloriesOut" component={CaloriesOut} />
//             <Stack.Screen name="Activity" component={Activity} />
//             <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
//             <Stack.Screen name="Steps" component={Steps} />
//         </Stack.Navigator>
//     )
// }