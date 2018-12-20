import * as React from 'react';

interface Props {
   className?: string;
   /**
    * Full name of the icon. Text is not validated so component may be blank
    * if name is incorrect.
    */
   name: string;
   onClick?: () => void;
}

/**
 * Standard material icon.
 * https://material.io/icons/
 */
export default (props: Props) => {
   if (props.name == null) {
      return null;
   }
   let css = 'material-icons';
   if (props.className) {
      css += ' ' + props.className;
   }
   return (
      <i onClick={props.onClick} className={css}>
         {props.name}
      </i>
   );
};
