import React from 'react';
import { Col, Row } from 'reactstrap';

const Header = () => {
  return (
    <div id="page-header" className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <h1>Read My Blog</h1>
          <p>This is Aiden's Blog</p>
        </Col>
      </Row>
    </div>
  );
};

export default Header;
