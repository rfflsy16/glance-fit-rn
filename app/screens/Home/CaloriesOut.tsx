import { useState } from 'react';
import type { TabType } from './common/HMetricsView';
import MetricsView from './common/HMetricsView';

const initialCaloriesOutData = {
  daily: {
    labels: ['04.00', '07.00', '10.00', '13.00', '16.00', '19.00'],
    datasets: [
      {
        data: [
          10, 35, 80, 120, 180, 234, 234, 234, 234, 234, 234, 234, 234, 234,
          234, 234, 234, 234,
        ],
      },
    ],
  },
  weekly: {
    labels: ['M', 'S', 'S', 'R', 'K', 'J', 'S'],
    datasets: [
      {
        data: [2000, 2123, 1980, 2123, 2200, 2050, 1950],
      },
    ],
    weeklyDetails: [
      { day: 'Hari ini', calories: 1950 },
      { day: 'Kemarin', calories: 2050 },
      { day: 'Rabu', calories: 2200 },
      { day: 'Selasa', calories: 2123 },
      { day: 'Senin', calories: 1980 },
      { day: 'Minggu', calories: 2123 },
      { day: 'Sabtu', calories: 2000 },
    ],
  },
  monthly: {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    datasets: [
      {
        data: [
          5000, 5100, 5200, 5300, 6000, 6000, 6000, 5300, 5200, 5100, 5000,
          4900, 4800, 4700, 4600, 4500, 4400, 4300, 4200, 4100, 4000, 3900,
          3800, 3700,
        ],
      },
    ],
    monthlyDetails: [
      { period: 'Minggu Ini', calories: 5380 },
      { period: '11-17 Agustus', calories: 5100 },
      { period: '4-10 Agustus', calories: 4700 },
      { period: '28-3 Agustus', calories: 4100 },
    ],
  },
};

export default function CaloriesOut({ navigation }: any) {
  const [caloriesOutData, setCaloriesOutData] = useState(
    initialCaloriesOutData
  );
  const [numbers, setNumbers] = useState({
    daily: 234,
    weekly: 2123,
    monthly: 5380,
  });

  const handlePeriodChange = async (date: Date, type: TabType) => {
    const newData = await fetchCaloriesOutData(date, type);

    setCaloriesOutData((prev) => ({
      ...prev,
      [type]: newData.chartData,
    }));

    setNumbers((prev) => ({
      ...prev,
      [type]: newData.number,
    }));
  };

  const fetchCaloriesOutData = async (date: Date, type: TabType) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dayOfMonth = date.getDate();
    const multiplier = (dayOfMonth % 3) + 0.8;

    if (type === 'daily') {
      return {
        chartData: {
          ...initialCaloriesOutData.daily,
          datasets: [
            {
              data: initialCaloriesOutData.daily.datasets[0].data.map((value) =>
                Math.round(value * multiplier)
              ),
            },
          ],
        },
        number: Math.round(234 * multiplier),
      };
    }

    if (type === 'weekly') {
      return {
        chartData: {
          ...initialCaloriesOutData.weekly,
          datasets: [
            {
              data: initialCaloriesOutData.weekly.datasets[0].data.map(
                (value) => Math.round(value * multiplier)
              ),
            },
          ],
          weeklyDetails: initialCaloriesOutData.weekly.weeklyDetails.map(
            (detail) => ({
              ...detail,
              calories: Math.round(detail.calories * multiplier),
            })
          ),
        },
        number: Math.round(2123 * multiplier),
      };
    }

    return {
      chartData: {
        ...initialCaloriesOutData.monthly,
        datasets: [
          {
            data: initialCaloriesOutData.monthly.datasets[0].data.map((value) =>
              Math.round(value * multiplier)
            ),
          },
        ],
        monthlyDetails: initialCaloriesOutData.monthly.monthlyDetails.map(
          (detail) => ({
            ...detail,
            calories: Math.round(detail.calories * multiplier),
          })
        ),
      },
      number: Math.round(5380 * multiplier),
    };
  };

  return (
    <MetricsView
      title="Kalori yang dibakar"
      navigation={navigation}
      descriptions={{
        daily: 'Kilokalori',
        weekly: 'Kilokalori',
        monthly: 'Kilokalori',
      }}
      numbers={numbers}
      suffix="kal"
      chartData={caloriesOutData}
      onPeriodChange={handlePeriodChange}
    />
  );
}
