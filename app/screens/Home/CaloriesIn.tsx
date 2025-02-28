import React, { useState } from 'react';
import type { TabType } from './common/HMetricsView';
import MetricsView from './common/HMetricsView';

const initialCaloriesInData = {
  daily: {
    labels: ['04.00', '07.00', '10.00', '13.00', '16.00', '19.00'],
    datasets: [
      {
        data: [
          0, 20, 45, 80, 120, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145,
          145, 145, 145,
        ],
      },
    ],
  },
  weekly: {
    labels: ['M', 'S', 'S', 'R', 'K', 'J', 'S'],
    datasets: [
      {
        data: [520, 535, 510, 535, 540, 525, 515],
      },
    ],
    weeklyDetails: [
      { day: 'Hari ini', calories: 515 },
      { day: 'Kemarin', calories: 525 },
      { day: 'Rabu', calories: 540 },
      { day: 'Selasa', calories: 535 },
      { day: 'Senin', calories: 510 },
      { day: 'Minggu', calories: 535 },
      { day: 'Sabtu', calories: 520 },
    ],
  },
  monthly: {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    datasets: [
      {
        data: [
          1600, 1650, 1700, 1750, 1758, 1758, 1758, 1750, 1700, 1650, 1600,
          1550, 1500, 1450, 1400, 1350, 1300, 1250, 1200, 1150, 1100, 1050,
          1000, 950,
        ],
      },
    ],
    monthlyDetails: [
      { period: 'Minggu Ini', calories: 1758 },
      { period: '11-17 Agustus', calories: 1650 },
      { period: '4-10 Agustus', calories: 1450 },
      { period: '28-3 Agustus', calories: 1150 },
    ],
  },
};

export default function CaloriesIn({ navigation }: any) {
  const [caloriesInData, setCaloriesInData] = useState(initialCaloriesInData);
  const [numbers, setNumbers] = useState({
    daily: 145,
    weekly: 535,
    monthly: 1758,
  });

  const handlePeriodChange = async (date: Date, type: TabType) => {
    const newData = await fetchCaloriesInData(date, type);

    setCaloriesInData((prev) => ({
      ...prev,
      [type]: newData.chartData,
    }));

    setNumbers((prev) => ({
      ...prev,
      [type]: newData.number,
    }));
  };

  const fetchCaloriesInData = async (date: Date, type: TabType) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dayOfMonth = date.getDate();
    const multiplier = (dayOfMonth % 3) + 0.8;

    if (type === 'daily') {
      return {
        chartData: {
          ...initialCaloriesInData.daily,
          datasets: [
            {
              data: initialCaloriesInData.daily.datasets[0].data.map((value) =>
                Math.round(value * multiplier)
              ),
            },
          ],
        },
        number: Math.round(145 * multiplier),
      };
    }

    if (type === 'weekly') {
      return {
        chartData: {
          ...initialCaloriesInData.weekly,
          datasets: [
            {
              data: initialCaloriesInData.weekly.datasets[0].data.map((value) =>
                Math.round(value * multiplier)
              ),
            },
          ],
        },
        number: Math.round(535 * multiplier),
      };
    }

    return {
      chartData: {
        ...initialCaloriesInData.monthly,
        datasets: [
          {
            data: initialCaloriesInData.monthly.datasets[0].data.map((value) =>
              Math.round(value * multiplier)
            ),
          },
        ],
      },
      number: Math.round(1758 * multiplier),
    };
  };

  return (
    <MetricsView
      title="Kalori yang dikonsumsi"
      navigation={navigation}
      descriptions={{
        daily: 'Kilokalori',
        weekly: 'Kilokalori',
        monthly: 'Kilokalori',
      }}
      numbers={numbers}
      suffix="kcal"
      chartData={caloriesInData}
      onPeriodChange={handlePeriodChange}
    />
  );
}
