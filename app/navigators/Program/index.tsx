import Detail from '@/screens/Program/Detail';
import Instruction from '@/screens/Program/Detail/Instruction';
import { Program } from '@/screens/Program/types';
import { createStackNavigator } from '@react-navigation/stack';

export type ProgramStackParamList = {
  Detail: {
    id: number;
    program?: Program;
  };
  Instruction: {
    id: number;
    programId?: number;
    weekNumber?: number;
    instructions?: any[];
  };
  // WeekDetail has been merged into Instruction
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
      {/* WeekDetail screen has been merged into Instruction */}
    </Stack.Navigator>
  );
}
