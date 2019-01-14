import * as React from 'react';

interface Props {
   disabled: boolean;
   label?: string;
   note?: string;
   /** RegEx validation pattern */
   pattern?: string;
}

export class Text extends React.PureComponent<Props, any> {
   constructor(props: Props) {
      super(props);
   }

   render() {
      return (
         <div className="inputField">
            {this.props.label && <label>{this.props.label}</label>}
            <input
               disabled={this.props.disabled}
               pattern={this.props.pattern}
               type="text"
            />
            {this.props.note && <div className="note">{this.props.note}</div>}
         </div>
      );
   }
}
