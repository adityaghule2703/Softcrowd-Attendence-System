// components/DoughnutChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DoughnutChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Desktop', 'Mobile', 'Tablet'],
          datasets: [{
            data: [54, 32, 14],
            backgroundColor: [
              '#00AEED',   // Cyan Blue - Desktop
              '#00AEEDCC', // Light Cyan - Mobile  
              '#424347'    // Dark Gray - Tablet
            ],
            borderWidth: 0,
            hoverOffset: 12,
            cutout: '65%',
            borderRadius: 4,
            spacing: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              align: 'center',
              labels: {
                padding: 12,
                usePointStyle: true,
                pointStyle: 'circle',
                color: '#6B7280',
                font: {
                  size: 11,
                  weight: '500'
                },
                boxWidth: 8,
                boxHeight: 8,
              }
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
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${percentage}% (${value}%)`;
                }
              }
            }
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10
            }
          },
          elements: {
            arc: {
              borderWidth: 0,
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

export default DoughnutChart;