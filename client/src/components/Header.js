import React from 'react';
import { Col, Row } from 'reactstrap';
import Typewriter from 'typewriter-effect';

const Header = () => {
  return (
    <div id="page-header" className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <h1>Aiden's Blog</h1>
          <Typewriter
            id="type"
            options={{
              strings: [
                'Hello',
                "I'm Aiden who dreams of becoming an awesome developer in Calgary",
                'Enjoy my blog',
              ],
              autoStart: true,
              loop: true,
              delay: 50,
            }}
          />
          {/* <p>I'm Aiden who dreams of becoming a great developer in Calgary.</p> */}
        </Col>
      </Row>
    </div>
  );
};

export default Header;
