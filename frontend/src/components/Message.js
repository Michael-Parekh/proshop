import React from 'react';
import { Alert } from 'react-bootstrap';

// The 'children' prop is the Message's inner text.
const Message = ({ variant, children }) => {
  return (
    <Alert variant={variant}>
      {children} 
    </Alert>
  )
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
