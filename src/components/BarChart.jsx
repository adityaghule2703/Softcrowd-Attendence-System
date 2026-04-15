// components/BarChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
          datasets: [
            {
              label: 'Revenue',
              data: [12450, 9850, 7890, 6540, 4920],
              backgroundColor: [
                '#00AEED',
                '#00AEEDCC',
                '#00AEED99',
                '#00AEED66',
                '#00AEED33'
              ],
              borderWidth: 0,
              borderRadius: 8,
              barPercentage: 0.65,
              categoryPercentage: 0.8,
              hoverBackgroundColor: '#424347',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
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
                stepSize: 5000,
              },
              border: {
                display: false
              },
              title: {
                display: true,
                text: 'Revenue ($)',
                color: '#9CA3AF',
                font: { size: 9, weight: '500' },
                padding: { bottom: 10 }
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                font: { size: 10, weight: '500' },
                color: '#6B7280',
                padding: 8,
              },
              border: {
                display: false
              }
            }
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 5,
              right: 5
            }
          },
          hover: {
            mode: 'index',
            intersect: false,
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

export default BarChart;