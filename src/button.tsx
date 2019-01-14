import * as React from 'react';

interface Props {
   disabled: boolean;
   label?: string;
}

export class Button extends React.PureComponent<Props, any> {
   constructor(props: Props) {
      super(props);
   }

   render() {
      return <button>{this.props.label}</button>;
   }
}
