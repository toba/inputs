import * as React from 'react';
import Icon from './icon';

interface Props {
   className?: string;
   /**
    * Full name of the icon. Text is not validated so component may be blank
    * if name is incorrect.
    */
   name: string;
   href: string;
}

/**
 * Standard material icon.
 * https://material.io/icons/
 */
export default (props: Props) => {
   if (props.name == null) {
      return null;
   }
   return (
      <a href={props.href} className={props.className}>
         <Icon name={props.name} />
      </a>
   );
};
