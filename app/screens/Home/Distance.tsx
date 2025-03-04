import { useState } from 'react';
import type { TabType } from './common/HMetricsView';
import MetricsView from './common/HMetricsView';

const initialDistanceData = {
  daily: {
    labels: ['04.00', '07.00', '10.00', '13.00', '16.00', '19.00'],
    datasets: [
      {
        data: [
          0.2, 0.5, 0.8, 1.2, 1.8, 2.1, 2.3, 2.4, 2.5, 2.6, 2.65, 2.7, 2.7, 2.7,
          2.7, 2.7, 2.7, 2.7,
        ],
      },
    ],
  },
  weekly: {
    labels: ['M', 'S', 'S', 'R', 'K', 'J', 'S'],
    datasets: [
      {
        data: [8.2, 9.5, 10.1, 10.5, 9.8, 8.9, 7.5],
      },
    ],
    weeklyDetails: [
      { day: 'Hari ini', calories: 7.5 },
      { day: 'Kemarin', calories: 8.9 },
      { day: 'Rabu', calories: 9.8 },
      { day: 'Selasa', calories: 10.5 },
      { day: 'Senin', calories: 10.1 },
      { day: 'Minggu', calories: 9.5 },
      { day: 'Sabtu', calories: 8.2 },
    ],
  },
  monthly: {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    datasets: [
      {
        data: [
          3800, 3950, 4050, 4150, 4200, 4245, 4245, 4200, 4150, 4100, 4050,
          4000, 3950, 3900, 3850, 3800, 3750, 3700, 3650, 3600, 3550, 3500,
          3450, 3400,
        ],
      },
    ],
    monthlyDetails: [
      { period: 'Minggu Ini', calories: 4245 },
      { period: '11-17 Agustus', calories: 4100 },
      { period: '4-10 Agustus', calories: 3900 },
      { period: '28-3 Agustus', calories: 3600 },
    ],
  },
};

export default function Distance({ navigation }: any) {
  const [distanceData, setDistanceData] = useState(initialDistanceData);
  const [numbers, setNumbers] = useState({
    daily: 2.7,
    weekly: 10.5,
    monthly: 4245,
  });

  const handlePeriodChange = async (date: Date, type: TabType) => {
    const newData = await fetchDistanceData(date, type);

    setDistanceData((prev) => ({
      ...prev,
      [type]: newData.chartData,
    }));

    setNumbers((prev) => ({
      ...prev,
      [type]: newData.number,
    }));
  };

  const fetchDistanceData = async (date: Date, type: TabType) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dayOfMonth = date.getDate();
    const multiplier = (dayOfMonth % 3) + 0.8;

    if (type === 'daily') {
      return {
        chartData: {
          ...initialDistanceData.daily,
          datasets: [
            {
              data: initialDistanceData.daily.datasets[0].data.map((value) =>
                Number((value * multiplier).toFixed(1))
              ),
            },
          ],
        },
        number: Number((2.7 * multiplier).toFixed(1)),
      };
    }

    if (type === 'weekly') {
      return {
        chartData: {
          ...initialDistanceData.weekly,
          datasets: [
            {
              data: initialDistanceData.weekly.datasets[0].data.map((value) =>
                Number((value * multiplier).toFixed(1))
              ),
            },
          ],
        },
        number: Number((10.5 * multiplier).toFixed(1)),
      };
    }

    return {
      chartData: {
        ...initialDistanceData.monthly,
        datasets: [
          {
            data: initialDistanceData.monthly.datasets[0].data.map((value) =>
              Math.round(value * multiplier)
            ),
          },
        ],
      },
      number: Math.round(4245 * multiplier),
    };
  };

  return (
    <MetricsView
      title="Jarak yang Ditempuh"
      navigation={navigation}
      descriptions={{
        daily: 'Kilometer',
        weekly: 'KM per hari (rata-rata)',
        monthly: 'Langkah per hari (rata-rata)',
      }}
      numbers={numbers}
      suffix="km"
      chartData={distanceData}
      onPeriodChange={handlePeriodChange}
    />
  );
}
