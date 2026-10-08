import { useEffect, useRef, useState } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  Filler,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  Filler,
);

export type ChartType = 'bar' | 'line' | 'scatter';

export interface ChartConfigData {
  type: ChartType;
  data: {
    labels?: string[];
    datasets: {
      label: string;
      data: number[] | { x: number; y: number }[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      pointRadius?: number;
      pointBackgroundColor?: string;
    }[];
  };
  options?: any;
}

export function useChart(canvasId: string) {
  const chartRef = useRef<Chart | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const render = (config: ChartConfigData) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(canvas, {
      type: config.type,
      data: config.data,
      options: config.options,
    });
  };

  return { render, ready };
}

export { Chart };
