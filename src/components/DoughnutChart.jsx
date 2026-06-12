// components/DoughnutChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const DoughnutChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const response = await axios.get('https://exilancesoftware.in/softcrowd-itr-attendance-management/public/api/domains', { headers });
        setDomains(response.data.data);
      } catch (err) {
        console.error('Error fetching domains:', err);
        setDomains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  useEffect(() => {
    if (!loading && chartRef.current && domains.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Generate random data for each domain (you can replace this with actual data from your API)
      const domainData = domains.map(() => Math.floor(Math.random() * 50) + 10);
      
      // Calculate total for percentage
      const total = domainData.reduce((acc, val) => acc + val, 0);
      
      // Generate colors with different opacities for each domain
      const colors = [
        '#00AEED',     // Primary Blue
        '#00AEEDCC',   // Light Blue (80%)
        '#00AEED99',   // Lighter Blue (60%)
        '#00AEED66',   // Very Light Blue (40%)
        '#00AEED33',   // Extremely Light Blue (20%)
        '#424347',     // Dark Gray
        '#6B7280',     // Medium Gray
        '#9CA3AF',     // Light Gray
        '#00AEED',     // Repeat colors if more domains
        '#424347',
      ];

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: domains.map(domain => domain.name),
          datasets: [{
            data: domainData,
            backgroundColor: domains.map((_, index) => colors[index % colors.length]),
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
  }, [loading, domains]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00AEED] mx-auto mb-2"></div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Loading domains...</p>
        </div>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs" style={{ color: '#9CA3AF' }}>No domains found</p>
      </div>
    );
  }

  return <canvas ref={chartRef} />;
};

export default DoughnutChart;