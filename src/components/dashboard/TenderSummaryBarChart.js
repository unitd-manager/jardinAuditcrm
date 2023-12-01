import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Row, Col } from 'reactstrap';
import ComponentCard from '../ComponentCard';
import api from '../../constants/api';

const TenderSummaryBarChart = () => {

  const [tender, setTender] = useState();
  const [amount, setAmount] = useState();
  
  const getTenders = () => {
    const comapnyNames = [];
    const totalQuoteAmt = []
    api.get('/tender/getTenderSummaryId').then((res) => {
      console.log(res.data.data)
      res.data.data.forEach((e) =>{
        comapnyNames.push(e.company_name)
        totalQuoteAmt.push(e.total_amount)
      })
      setTender(comapnyNames)
      setAmount(totalQuoteAmt)
    });
    
  };

  useEffect(() => {
    getTenders();
  }, []);

    const optionscolumn = {
        colors: ['#745af2'],
        chart: {
          fontFamily: "'Rubik', sans-serif",
        },
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '55%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: tender,
          labels: {
            style: {
              cssClass: 'grey--text lighten-2--text fill-color',
            },
          },
        },
        yaxis: {
          title: {
            text: '$ (thousands)',
            color: '#8898aa',
          },
          labels: {
            style: {
              cssClass: 'grey--text lighten-2--text fill-color',
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter(val) {
              return `$ ${val} thousands`;
            },
          },
        },
        grid: {
          borderColor: 'rgba(0,0,0,0.1)',
        },
        legend: {
          show: true,
          position: 'bottom',
          width: '50px',
          fontFamily: "'Montserrat', sans-serif",
          labels: {
            colors: '#8898aa',
          },
        },
      };
    
      const seriescolumn = [
        {
          name: 'Desktop',
          data: amount,
        },
      ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Earnings                                                 */
    /*--------------------------------------------------------------------------------*/
    <Row>
      <Col>
        <ComponentCard title="Tender Summary Chart">
          <Chart options={optionscolumn} series={seriescolumn} type="bar" height="280" />
        </ComponentCard>
      </Col>
    </Row>
  );
};

export default TenderSummaryBarChart;
