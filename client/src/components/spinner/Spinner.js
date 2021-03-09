import React from 'react';
import { Row } from 'reactstrap';
import { FadeLoader } from 'react-spinners';
export const GrowingSpinner = (
  <>
    <Row className="d-flex justify-content-center m-5">
      <FadeLoader className="spinner" color="grey" />
    </Row>
  </>
);
