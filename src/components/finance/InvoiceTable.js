import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

const CreateReceipt = ({ createInvoice, handleInserts }) => {
  CreateReceipt.propTypes = {
    createInvoice: PropTypes.object,
    handleInserts: PropTypes.func,
  };
  return (
    <>
     
      <Col md="4">
        <FormGroup>
          <Label>Quote Code</Label>
          <Input
            type="text"
            onChange={handleInserts}
            value={createInvoice && createInvoice.quote_code}
            name="quote_code"
          />
        </FormGroup>
      </Col>
    
      <Col md="4">
        <FormGroup>
          <Label>Invoice date</Label>
          <Input
            type="date"
            onChange={handleInserts}
            value={createInvoice && createInvoice.invoice_date}
            name="invoice_date"
          />
        </FormGroup>
      </Col>
       <Col md="4">
        <FormGroup>
          <Label>Attention</Label>
          <Input
            type="text"
            onChange={handleInserts}
            value={createInvoice && createInvoice.attention}
            name="attention"
          />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Reference</Label>
          <Input
            type="textarea"
            onChange={handleInserts}
            value={createInvoice && createInvoice.reference}
            name="reference"
          />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Invoice Terms</Label>
          <Input
            type="text"
            onChange={handleInserts}
            value={createInvoice && createInvoice.invoice_terms}
            name="invoice_terms"
          />
        </FormGroup>
      </Col>
      <Col md="4">
        <FormGroup>
          <Label>Discount</Label>
          <Input
            type="number"
            onChange={handleInserts}
            value={createInvoice && createInvoice.discount}
            name="discount"
          />
        </FormGroup>
      </Col>
    </>
  );
};

export default CreateReceipt;
