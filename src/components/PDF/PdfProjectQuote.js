import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as numberToWords from 'number-to-words';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import moment from 'moment';
import api from '../../constants/api';

const PdfProjectQuote = ({ id, quoteId }) => {
  PdfProjectQuote.propTypes = {
    id: PropTypes.any,
    quoteId: PropTypes.any,
  }
  const [quote, setQuote] = React.useState([]);
  const [projectDetail, setProjectDetail] = useState();
  const [lineItem, setLineItem] = useState([]);
  const [gTotal, setGtotal] = React.useState(0);
  // const [hfdata, setHeaderFooterData] = React.useState();

 
  const getProjectById = () => {
    api
      .post('/project/getProjectById', { project_id: id })
      .then((res) => {
        setProjectDetail(res.data.data);
      })
      .catch(() => { });
  };

  // Get Quote By Id
  const getQuote = () => {
    api.post('/project/getTabQuoteById', { project_id: id }).then((res) => {
      setQuote(res.data.data[0]);
      console.log('quote2', res.data.data[0]);
    });
  };
  // const calculateTotal = () => {

  const calculateTotal = () => {
    const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
    const discount = quote.discount || 0; // Get the discount from the quote or default to 0 if not provided
    const total = grandTotal - discount; // Deduct the discount from the grand total

    return total;
  };
  const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
  React.useEffect(() => {
    // Other logic you have here...

    // Update this part of your code to handle HTML content stored in the quote_condition field
    const parseHTMLContent = (htmlContent) => {
      if (htmlContent) {
        // Remove HTML tags using a regular expression
        const plainText = htmlContent.replace(/<[^>]*>?/gm, '');
        setParsedQuoteCondition(plainText);
      }
    };

    // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
    parseHTMLContent(quote.quote_condition);

    // Other logic you have here...
  }, [quote.quote_condition]);
  
 //The quote_condition content and format it as bullet points
  const formatQuoteConditions = (conditionsText) => {
    const formattedConditions = conditionsText.split(':-').map((condition, index) => {
      const trimmedCondition = condition.trim();
      return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
    });
    return formattedConditions;
  };

  // Format the conditions content for PDF
  const conditions = formatQuoteConditions(parsedQuoteCondition);
  const conditionsContent = conditions.map((condition) => ({
    text: `${condition}`,
    fontSize: 10,
    margin: [15, 5, 0, 0],
    style: ['notesText', 'textSize'],
  }));

  //const parsedQuoteConditionWithoutHTMLSpaces = replaceHTMLSpaces(parsedQuoteCondition);
  const getQuoteById = () => {
    api
      .post('/project/getQuoteLineItemsById', { quote_id: quoteId })
      .then((res) => {
        setLineItem(res.data.data);
        console.log('quote1', res.data.data);
        let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
        });
        setGtotal(grandTotal);
      })
      .catch(() => { });
  };
  React.useEffect(() => {
    getQuote();
    getQuoteById();
    getProjectById();
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
          style: 'tableBody1',
        },
        {
          text: `${element.description}`,
          border: [false, false, false, true],
          style: 'tableBody1',
        },

        {
          text: `${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          fillColor: '#f5f5f5',
          style: 'tableBody2',
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
              text: `${projectDetail.company_name ? projectDetail.company_name : ''}
                              ${projectDetail.address_flat ? projectDetail.address_flat : ''}
                              ${projectDetail.address_country ? projectDetail.address_country : ''}
                              ${projectDetail.address_po_code ? projectDetail.address_po_code : ''}`,
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
          text: `Att : ${projectDetail.first_name ? projectDetail.first_name : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'true'
        },

        '\n',

        {
          text: `Project :-    ${projectDetail.title ? projectDetail.title : ''}`,
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
            widths: [30, 140, 145, 120],

            body: lineItemBody,
          },
        },
        '\n',
        {
          stack: [
            {
              text: `SubTotal $ :     ${gTotal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 41, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `Discount  :           ${quote.discount ? quote.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0'}`,
              alignment: 'right',
              margin: [0, 0, 41, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `Total $ :     ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
              alignment: 'right',
              margin: [0, 0, 41, 0],
              style: 'textSize',
            },
            '\n',
            //   {
            //     text: `Total $ :     ${calculateTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            //     alignment: 'right',
            // margin: [0, 0, 41, 0],
            // style: 'textSize',
            //   },
            '\n\n',
            // { text: `TOTAL : ${Converter.toWords(calculateTotal())}`, style: 'bold', margin: [40, 0, 0, 0] },
            {
              text: `TOTAL :  ${numberToWords.toWords(calculateTotal()).toUpperCase()}`, // Convert total to words in uppercase
              bold: 'true',
              fontSize: '11',
              margin: [40, 0, 0, 0],
            },
          ],
        },
        '\n\n',
   
        
        {
          text: `Terms and Conditions: `,
          fontSize: 11,
          decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },  
        ...conditionsContent, // Add each condition as a separate paragraph
        // ... (remaining parts of the PDF content)
        // {
        //   text: ` ${parsedQuoteConditionWithoutHTMLSpaces}`,
        //   fontSize: 10,
        //   style: ['notesText', 'textSize'],
        // },
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
          alignment: 'center',
          fontSize: 10,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
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

export default PdfProjectQuote;
