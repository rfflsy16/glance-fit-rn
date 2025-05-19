import { useState } from 'react';
import type { TabType } from './common/HMetricsView';
import MetricsView from './common/HMetricsView';

// Initial data structure
const initialStepsData = {
  daily: {
    labels: ['04.00', '07.00', '10.00', '13.00', '16.00', '19.00'],
    datasets: [
      {
        data: [
          300, 800, 1200, 2500, 3500, 4200, 4500, 4700, 4800, 4900, 4950, 5000,
          5000, 5000, 5000, 5000, 5000, 5000,
        ],
      },
    ],
  },
  weekly: {
    labels: ['M', 'S', 'S', 'R', 'K', 'J', 'S'],
    datasets: [
      {
        data: [850, 920, 890, 933, 910, 880, 845],
      },
    ],
    weeklyDetails: [
      { day: 'Hari ini', calories: 845 },
      { day: 'Kemarin', calories: 880 },
      { day: 'Rabu', calories: 910 },
      { day: 'Selasa', calories: 933 },
      { day: 'Senin', calories: 890 },
      { day: 'Minggu', calories: 920 },
      { day: 'Sabtu', calories: 850 },
    ],
  },
  monthly: {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    datasets: [
      {
        data: [
          3500, 7000, 1750, 200, 5200, 3000, 5024, 1000, 7000, 5000, 2000, 7000,
          5000, 2000, 7000, 5000, 2000, 7000, 5000, 2000, 7000, 5000, 2000,
          7000,
        ],
      },
    ],
    maximum: 7000,
    monthlyDetails: [
      { period: 'Minggu Ini', calories: 5024 },
      { period: '11-17 Agustus', calories: 4900 },
      { period: '4-10 Agustus', calories: 4700 },
      { period: '28-3 Agustus', calories: 4400 },
    ],
  },
};

export default function Steps({ navigation }: any) {
  const [stepsData, setStepsData] = useState(initialStepsData);
  const [numbers, setNumbers] = useState({
    daily: 5000,
    weekly: 933,
    monthly: 5024,
  });

  const handlePeriodChange = async (date: Date, type: TabType) => {
    // Here you would typically fetch data from your API based on the date and type
    // For demonstration, we'll simulate data changes
    const newData = await fetchStepsData(date, type);

    setStepsData((prev) => ({
      ...prev,
      [type]: newData.chartData,
    }));

    setNumbers((prev) => ({
      ...prev,
      [type]: newData.number,
    }));
  };

  // This would be your actual API call
  const fetchStepsData = async (date: Date, type: TabType) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simulate different data for different dates
    const dayOfMonth = date.getDate();
    const multiplier = (dayOfMonth % 3) + 0.8; // Creates some variation

    if (type === 'daily') {
      return {
        chartData: {
          ...initialStepsData.daily,
          datasets: [
            {
              data: initialStepsData.daily.datasets[0].data.map((value) =>
                Math.round(value * multiplier)
              ),
            },
          ],
        },
        number: Math.round(5000 * multiplier),
      };
    }

    // Similar logic for weekly and monthly...
    return {
      chartData: stepsData[type],
      number: numbers[type],
    };
  };

  return (
    <MetricsView
      title="Performa Langkah Anda"
      navigation={navigation}
      descriptions={{
        daily: 'Langkah',
        weekly: 'Langkah per hari (rata-rata)',
        monthly: 'Langkah per hari (rata-rata)',
      }}
      numbers={numbers}
      chartData={stepsData}
      onPeriodChange={handlePeriodChange}
    />
  );
}
