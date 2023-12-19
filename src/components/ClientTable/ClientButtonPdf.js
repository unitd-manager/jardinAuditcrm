import React from 'react';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import PdfClientIncorporationDetails from '../PDF/PdfClientIncorporationDetails';
import PdfClientPaidUpCapital from '../PDF/PdfClientPaidUpCapital';
import PdfClientContract from '../PDF/PdfClientContract';
import PdfActivity from '../PDF/PdfActivity';
import PdfClientEp200 from '../PDF/PdfClientEp200';
import PdfClientRickAssessment from '../PDF/PdfClientRickAssessment';
import ComponentCardV2 from '../ComponentCardV2';

export default function ClientButtonPdf() {

  return (
    <Form>
      <FormGroup>
        {/* Button */}
        <ComponentCardV2>
          <Row>
            <Col>
              <PdfClientIncorporationDetails></PdfClientIncorporationDetails>
            </Col>
            <Col>
              <PdfClientPaidUpCapital></PdfClientPaidUpCapital>
            </Col>
            <Col>
              <PdfClientContract></PdfClientContract>
            </Col>
            <Col>
              <PdfActivity></PdfActivity>
            </Col>
            <Col>
              <PdfClientEp200></PdfClientEp200>
            </Col>
            <Col>
              <PdfClientRickAssessment></PdfClientRickAssessment>
            </Col>
{/* 
            <Col>
              <Button
                className="shadow-none"
                color="primary"
                onClick={() => {
                  backToList();
                  console.log('back to list');
                }}
              >
                BackToList
              </Button>
            </Col> */}
          </Row>
        </ComponentCardV2>
      </FormGroup>
    </Form>
  );
}
