import './toggle.scss';
import * as React from 'react';
import Icon from './icon';
import { eventCoord } from 'lib/utility';

interface Props {
   checked?: boolean;
   className?: string;
   onBlur?: (e: Event) => void;
   onFocus?: (e: Event) => void;
   onChange?: (selected: boolean) => void;
   onIcon?: string;
   offIcon?: string;
   disabled?: boolean;
}

interface State {
   checked: boolean;
}

/**
 * https://github.com/aaronshaf/react-toggle/blob/master/src/component/index.js
 */
export default class Toggle extends React.Component<Props, State> {
   previouslyChecked = false;
   moved = false;
   input: HTMLInputElement = null;
   startX: number = null;
   activated = false;

   constructor(props: Props) {
      super(props);
      this.state = { checked: props.checked !== undefined && props.checked };
      this.previouslyChecked = this.state.checked;
   }

   emitChange() {
      if (this.props.onChange !== undefined) {
         this.props.onChange(this.state.checked);
      }
      this.input.checked = this.state.checked;
   }

   handleClick(e: MouseEvent) {
      e.preventDefault();
      this.previouslyChecked = this.state.checked;
      this.setState({ checked: !this.state.checked }, this.emitChange);
   }

   handleTouchStart(e: TouchEvent) {
      this.startX = eventCoord(e).x;
      this.activated = true;
   }

   handleTouchMove(e: TouchEvent) {
      if (!this.activated) {
         return;
      }
      this.moved = true;

      if (this.startX) {
         const currentX = eventCoord(e).x;
         if (this.state.checked && currentX + 15 < this.startX) {
            this.setState({ checked: false });
            this.startX = currentX;
            this.activated = true;
         } else if (currentX - 15 > this.startX) {
            this.setState({ checked: true });
            this.startX = currentX;
            this.activated = currentX < this.startX + 5;
         }
      }
   }

   handleTouchEnd(e: TouchEvent) {
      if (!this.moved) {
         return;
      }
      e.preventDefault();

      const update = (checked: boolean) => {
         if (this.previouslyChecked !== this.state.checked) {
            this.setState({ checked }, this.emitChange);
            this.previouslyChecked = this.state.checked;
         }
      };

      if (this.startX) {
         const endX = eventCoord(e).x;
         if (this.previouslyChecked === true && this.startX + 4 > endX) {
            update(false);
         } else if (this.startX - 4 < endX) {
            update(true);
         }
         this.activated = false;
         this.startX = null;
         this.moved = false;
      }
   }

   // componentWillReceiveProps(next:Props) {
   //    if ("checked" in next) {
   //       this.setState({ checked: !next.checked });
   //    }
   // }

   render() {
      let css = 'toggle';
      if (this.state.checked) {
         css += ' checked';
      }
      if (this.props.disabled) {
         css += ' disabled';
      }

      return (
         <div
            className={css}
            onClick={this.handleClick.bind(this)}
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchMove={this.handleTouchMove.bind(this)}
            onTouchEnd={this.handleTouchEnd.bind(this)}
         >
            <div className="track">
               <Icon className="on" name="done" />
               <Icon className="off" name="clear" />
            </div>
            <div className="thumb" />
            <input
               ref={el => {
                  this.input = el;
               }}
               type="checkbox"
            />
         </div>
      );
   }
}
