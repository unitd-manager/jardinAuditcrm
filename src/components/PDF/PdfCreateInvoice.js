import React from 'react';
import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import moment from 'moment';
import * as numberToWords from 'number-to-words';
// //import { useParams } from 'react-router-dom';
// import Converter from 'number-to-words';
import api from '../../constants/api';
import message from '../Message';


const PdfCreateInvoice = ({ invoiceId}) => {
  PdfCreateInvoice.propTypes = {
    invoiceId:PropTypes.any,
  };
  const [hfdata, setHeaderFooterData] = React.useState();

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };

  const [cancelInvoice, setCancelInvoice] = React.useState([]);
  const [createInvoice, setCreateInvoice] = React.useState(null);
  const [gTotal, setGtotal] = React.useState(0);
  

  // Gettind data from Job By Id
  const getInvoiceById = () => {
    api
      .post('/invoice/getInvoiceByInvoiceId', { invoice_id: invoiceId })
      .then((res) => {
        setCreateInvoice(res.data.data);
      })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };
  const calculateTotal = () => {
    const grandTotal = cancelInvoice.reduce((acc, element) => acc + element.total_cost, 0);
    const gstValue = createInvoice.gst_value || 0;
    const total = grandTotal + gstValue;
    return total;
  };
  const getInvoiceItemById = () => {
    api
      .post('/invoice/getProjectInvoicePdf', { invoice_id: invoiceId })
      .then((res) => {
        setCancelInvoice(res.data.data);
        //grand total
        console.log('quote1', res.data.data);
         let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.total_cost;
        });

        setGtotal(grandTotal);
      })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };
  React.useEffect(() => {
    getInvoiceItemById();
    getInvoiceById();
  }, []);

  const GetPdf = () => {
    const productItems = [
      [
        {
          text: 'Sn',
          style: 'tableHead',
        },
        {
          text: 'Item',
          style: 'tableHead',
        },
        {
          text: 'Description',
          style: 'tableHead',
        },

        {
          text: 'Total Amount',
          style: 'tableHead',
         
        },
      ],
    ];
    cancelInvoice.forEach((element, index) => {
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.item_title ? element.item_title : ''}`,
          border: [false, false, false, true],
          style: 'tableBody1',
        },
        {
          text: `${element.description ? element.description : ''}`,
          border: [false, false, false, true],
          style: 'tableBody1',
        },
        {
          text: `${element.total_cost .toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          fillColor: '#f5f5f5',
          style: 'tableBody2',
          alignment:'right'
        },
      ]);
    });

    const dd = {
      pageSize: 'A4',
     content: [
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['101%'],
            body: [
              [
                {
                  text: `TAX INVOICE`,
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',

        {
          columns: [
            
            {
              stack: [
                {
                  text: `To:`},
                  {
                    text:`${createInvoice.company_name ? createInvoice.company_name : ''}\n${
                    createInvoice.cust_address1 ? createInvoice.cust_address1 : ''
                  }\n ${createInvoice.cust_address2 ? createInvoice.cust_address2 : ''}\n${
                    createInvoice.cust_address_country ? createInvoice.cust_address_country : ''
                  }\n${
                    createInvoice.cust_address_po_code ? createInvoice.cust_address_po_code : ''
                  }`,
                  style: ['textSize'],
                  margin: [15, 0, -10, 0],
                },
                '\n',
              ],
            },
            {
              stack: [
                {
                  text: ` Invoice No:${
                    createInvoice.invoice_code ? createInvoice.invoice_code : ''
                  } `,
                  style: ['textSize'],
                  margin: [100, 0, 0, 0],
                },
                {text: `Date :${(createInvoice.invoice_date)? moment(createInvoice.invoice_date).format('DD-MM-YYYY'):''}`,
                  style: ['textSize'],
                  margin: [100, 0, 0, 0],
                },
                {
                  text: `Quote Code :${createInvoice.quote_code ? createInvoice.quote_code : ''} `,
                  style: ['textSize'],
                  margin: [100, 0, 0, 0],
                },
                '\n',
              ],
            },
          ],
        },
        '\n',

        {
          columns: [
            {
              text: `ATTN : ${
                createInvoice.attention ? createInvoice.attention : ''
              }\n Site Name : ${
                createInvoice.title ? createInvoice.title : ''
              } \n Reference :  ${
                createInvoice.reference ? createInvoice.reference : ''
              }\n \n`,
              style: 'textSize',
              bold: true,
            },
          ],
        },
        '\n',

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: [30, 140, 145, 120],

            body: productItems,
          },
        },
        '\n\n',
       
            {
              stack: [
                {
                  text: `TOTAL $ : ${gTotal.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  alignment: 'right',
                  margin: [0, 0, 41, 0],
                  style: 'textSize',
                },
                '\n',
                {
                  text: `GST ${createInvoice.gst_percentage? createInvoice.gst_percentage : ''}% :      ${createInvoice.gst_value.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  alignment: 'right',
                  margin: [0, 0, 41, 0],
                  style: 'textSize',
                },
                '\n',
                {
                  text: `GRAND TOTAL ($) : ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  alignment: 'right',
              margin: [0, 0, 41, 0],
              style: 'textSize',
                },
                '\n\n\n\n',
                {
                  text: `TOTAL :  ${numberToWords.toWords(calculateTotal()).toUpperCase()}`, // Convert total to words in uppercase
                  bold:'true',
                  fontSize:'11',
                  margin: [40, 0, 0, 0],
                },
              
              ],
            },
            '\n\n',
            
        
         //{ text: `Total $ :${Converter.toWords(Total)}` },
 
        //  {
        //   text: `Terms and Condition:-`,
        //   decoration: 'underline',
        //   alignment:'Left',
          
        //              },'\n',
        // {
        //   text: `${findCompany("cp.quoteTermsAndCondition")}`,
        //   style: ['notesText', 'textSize'],
        //   margin:[30,0,0,0]
        // },
        // {
        //   text: 'Terms and conditions : \n\n 1.The above rates are in Singapore Dollars. \n\n 2. Payment Terms 30 days from the date of Invoice \n\n  3.Payment should be made in favor of " CUBOSALE ENGINEERING PTE LTD " \n\n 4.Any discrepancies please write to us within 3 days from the date of invoice  \n\n\n 5. For Account transfer \n\n \n\n',
        //   style: 'textSize',
        //   // margin: [0, 5, 0, 10],
        // },
         {
          text: `Terms and Condition:-`,
          style: ['notesText', 'textSize'],
          decoration: 'underline',
          alignment: 'Left',

        }, '\n',
        {
          text: `${findCompany("cp.paymentTermsInvoice")}`,
          style: ['notesText', 'textSize'],
          fontSize:10,
          margin: [20, 0, 0, 0]
        },
       

        '\n\n',
      ],
      margin: [0, 50, 50, 50],

      styles: {
        logo: {
          margin: [-20, 20, 0, 0],
        },
        address: {
          margin: [-10, 20, 0, 0],
        },
        invoice: {
          margin: [0, 30, 0, 10],
          alignment: 'right',
        },
        invoiceAdd: {
          alignment: 'right',
        },
        textSize: {
          fontSize: 10,
        },
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 10,
          alignment:'center',
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
        tableBody1: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
        tableBody2: {
          border: [false, false, false, true],
          margin: [0, 5, 35, 5],
          alignment: 'right',
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print Invoice
      </Button>
    </>
  );
};

export default PdfCreateInvoice;