import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as numberToWords from 'number-to-words';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import moment from 'moment';
import message from '../Message';
import api from '../../constants/api';

const PdfQuote = ({ id, quoteId }) => {
  PdfQuote.propTypes = {
    id: PropTypes.any,
    quoteId: PropTypes.any,
  }
  const [quote, setQuote] = React.useState([]);
  const [tenderDetails, setTenderDetails] = useState(null);
  const [lineItem, setLineItem] = useState([]);
  // const [gTotal, setGtotal] = React.useState(0);
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

  const getCompany = () => {
    api
      .post('/tender/getTendersById', { opportunity_id: id })
      .then((res) => {
        setTenderDetails(res.data.data);
        console.log(res);
      })
      .catch(() => { });
  };

  // Get Quote By Id
  const getQuote = () => {
    api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
      setQuote(res.data.data[0]);
      console.log('quote', res.data.data[0]);
    });
  };
  const calculateTotal = () => {
    const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
    return grandTotal;
    // const gstValue = quote.gst_value || 0;
    // const total = grandTotal + gstValue;
    // return total;
  };
  const getQuoteById = () => {
    api
      .post('/tender/getQuoteLineItemsById', { quote_id: quoteId })
      .then((res) => {
        setLineItem(res.data.data);
        console.log('quote1', res.data.data);
        // let grandTotal = 0;
        // res.data.data.forEach((elem) => {
        //   grandTotal += elem.amount;
        // });
        //setGtotal(grandTotal);
      })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };
  React.useEffect(() => {
    getQuote();
    getQuoteById();
    getCompany();
  }, []);

  const GetPdf = () => {
    const lineItemBody = [
      [
        {
          text: 'SN',
          style: 'tableHead',
        },
        {
          text: 'Title',
          style: 'tableHead',
        },
        {
          text: 'Description',
          style: 'tableHead',
        },

        {
          text: 'Amt S$',
          style: 'tableHead',
        },

      ],
    ];
    lineItem.forEach((element, index) => {
      lineItemBody.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.title}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.description}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },

        {
          text: `${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          fillColor: '#f5f5f5',
          style: 'tableBody',
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
            widths: ['105%', '51%'],

            body: [
              [
                {
                  text: 'QUOTATION',
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
              text: `TO`,
              style: ['notesText', 'textSize'],
              bold: 'true'
            },
            {
              text: `${tenderDetails.company_name ? tenderDetails.company_name : ''}
                              ${tenderDetails.address_flat ? tenderDetails.address_flat : ''}
                              ${tenderDetails.address_country ? tenderDetails.address_country : ''}
                              ${tenderDetails.address_po_code ? tenderDetails.address_po_code : ''}`,
              style: ['notesText', 'textSize'],
              margin: [-250, 20, 0, 0],


              bold: 'true'
            },
          ],
        },

        {
          text: `Date :   ${(quote.quote_date) ? moment(quote.quote_date).format('DD-MM-YYYY') : ''}
           Quote Code :  ${quote.quote_code ? quote.quote_code : ''
            }\n \n  `,
          style: ['invoiceAdd', 'textSize'],
          margin: [0, -60, 0, 0]
        },

        '\n\n\n',
        {
          text: `Att : ${tenderDetails.first_name ? tenderDetails.first_name : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'true'
        },

        '\n',

        {
          text: `Project :-    ${tenderDetails.title ? tenderDetails.title : ''}`,
          bold: 'true',
          style: ['notesText', 'textSize'],
        },
        {
          text: `Dear Sir,

           With reference to the above captions, we would like to thank you for inviting us to quote for the above mentioned works and we are pleased to submit herewith our Value Quotation for you kind persual.`,

          style: ['notesText', 'textSize'],
        },
        '\n',
        '\n',

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
            widths: [90, 130, 115, 100],

            body: lineItemBody,
          },
        },
        '\n',
        {
          stack: [
            // {
            //   text: `SubTotal $ :     ${gTotal.toLocaleString('en-IN', {
            //     minimumFractionDigits: 2,
            //   })}`,
            //   alignment: 'right',
            //   margin: [0, 0, 60, 0],
            //   style: 'textSize',
            // },
            // '\n',
            // {
            //   text: `Discount  :         ${quote.discount ? quote.discount : ''}`,
            //   alignment: 'right',
            //   margin: [0, 0, 60, 0],
            //   style: 'textSize',
            // },
            
            // '\n',
            //   {
            //     text: `Total $ :     ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            //     alignment: 'right',
            // margin: [0, 0, 60, 0],
            // style: 'textSize',
            //   },
            {
              text: `GRAND TOTAL ($) :  ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
              alignment: 'right',
              margin: [0, 0, 67, 0],
              style: 'textSize',
            },
            '\n\n\n',
            {
              text: `TOTAL :  ${numberToWords.toWords(calculateTotal()).toUpperCase()}`, // Convert total to words in uppercase
              style: 'bold',
              fontSize:12,
              margin: [40, 0, 0, 0],
            },
          ],
        },
        '\n\n',
        '\n',
        {
          text: `Terms and Condition:-`,
          decoration: 'underline',
          alignment: 'Left',

        }, '\n',
        {
          text: `${findCompany("cp.quoteTermsAndCondition")}`,
          style: ['notesText', 'textSize'],
          fontSize:10,
          margin: [30, 0, 0, 0]
        },
        //         {
        //           columns: [
        //             {
        //               text: `Terms and Condition:- \n
        // :- Payment : COD \n
        // :- The above quote does not cover replacement of any parts unless expressly stated above. \n
        // :- We reserve the right to terminate any scope of work in event where there is a default to our Payment Schedule`,

        //               style: ['notesText', 'textSize'],
        //             },
        //           ],
        //         },

        '\n',
        '\n',

        {
          width: '100%',
          alignment: 'center',
          text: 'Thank you very much for your business',
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 12,
        },
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
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 10.5,
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
      <span onClick={GetPdf}>
        <Icon.Printer />
      </span>
    </>
  );
};

export default PdfQuote;
