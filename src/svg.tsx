import * as React from 'react';
import 'whatwg-fetch';
import { is } from '@toba/tools';

interface Props {
   src: string;
   width?: number;
   height?: number;
   className?: string;
}

interface State {
   status: Status;
   svg?: LiteralHTML;
}

interface LiteralHTML {
   __html: string;
}

interface Size {
   width: string;
   height: string;
}

enum Status {
   Pending,
   Loading,
   Ready,
   Error
}

/**
 * Load SVG source and inject its XML into the document.
 */
export default class extends React.PureComponent<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { status: Status.Pending };
   }

   componentDidMount() {
      fetch(this.props.src)
         .then(res => res.text())
         .then(xml => {
            this.setState({
               status: Status.Ready,
               svg: { __html: xml }
            });
         })
         .catch(err => {
            console.error('Unable to load ' + this.props.src, err);
            this.setState({
               status: Status.Error
            });
         });
   }

   render() {
      let css = 'svg';
      if (!is.empty(this.props.className)) {
         css += ' ' + this.props.className;
      }
      const style = {} as Size;

      if (this.props.width) {
         style.width = this.props.width + 'px';
      }
      if (this.props.height) {
         style.height = this.props.height + 'px';
      }

      if (this.state.status == Status.Ready) {
         return (
            <div
               className={css}
               style={style}
               dangerouslySetInnerHTML={this.state.svg}
            />
         );
      } else {
         if (this.state.status == Status.Error) {
            css += ' error';
         }
         return <div className={css} style={style} />;
      }
   }
}
