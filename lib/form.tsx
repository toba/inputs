import * as React from 'react';

interface FormProps {
   action: string;
}

export class Form extends React.PureComponent<FormProps, any> {
   render() {
      return <form action={this.props.action}>{this.props.children}</form>;
   }
}
