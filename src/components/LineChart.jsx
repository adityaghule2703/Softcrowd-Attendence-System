// components/LineChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Revenue',
              data: [42000, 45000, 52000, 58000, 65000, 72000, 78000, 82000, 85000, 88000, 92000, 95000],
              borderColor: '#00AEED',
              backgroundColor: 'rgba(0, 174, 237, 0.05)',
              fill: true,
              tension: 0.4,
              borderWidth: 2.5,
              pointRadius: 3,
              pointHoverRadius: 6,
              pointBackgroundColor: '#00AEED',
              pointBorderColor: '#FFFFFF',
              pointBorderWidth: 2,
              pointHoverBackgroundColor: '#0099cc',
              pointHoverBorderColor: '#FFFFFF',
            },
            {
              label: 'Orders',
              data: [18000, 19500, 22000, 25000, 28000, 32000, 35000, 38000, 40000, 42000, 45000, 48000],
              borderColor: '#424347',
              backgroundColor: 'rgba(66, 67, 71, 0.05)',
              fill: true,
              tension: 0.4,
              borderWidth: 2.5,
              pointRadius: 3,
              pointHoverRadius: 6,
              pointBackgroundColor: '#424347',
              pointBorderColor: '#FFFFFF',
              pointBorderWidth: 2,
              pointHoverBackgroundColor: '#2d2e31',
              pointHoverBorderColor: '#FFFFFF',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
              align: 'start',
              labels: {
                usePointStyle: true,
                padding: 15,
                color: '#6B7280',
                font: {
                  size: 11,
                  weight: '500'
                },
                boxWidth: 10,
                boxHeight: 10
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#FFFFFF',
              titleColor: '#424347',
              bodyColor: '#6B7280',
              titleFont: { size: 11, weight: 'bold' },
              bodyFont: { size: 10 },
              padding: 10,
              borderColor: '#E5E7EB',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += '$' + context.parsed.y.toLocaleString();
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 174, 237, 0.08)',
                drawTicks: false,
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                },
                font: { size: 10, weight: '500' },
                color: '#9CA3AF',
                padding: 8,
              },
              border: {
                display: false
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                font: { size: 10, weight: '500' },
                color: '#9CA3AF',
                padding: 8,
              },
              border: {
                display: false
              }
            }
          },
          elements: {
            line: {
              borderJoin: 'round',
              borderCap: 'round',
            },
            point: {
              hoverRadius: 6,
            }
          },
          layout: {
            padding: {
              top: 10,
              bottom: 5,
              left: 5,
              right: 5
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default LineChart;