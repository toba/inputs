import * as React from 'react';
import { flux } from 'lib/state/hub';
import { ActionType } from 'modules/actions';

interface Props {
   action: ActionType;
   text: string;
   data?: any;
}

export default (props: Props) => (
   <a
      onClick={(e: any) => {
         e.preventDefault();
         flux.emit(props.action, props.data);
      }}
   >
      {props.text}
   </a>
);
