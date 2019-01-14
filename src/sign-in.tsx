import './sign-in.scss';
import * as React from 'react';
import SVG from 'jsx/svg';
import { AuthLink } from 'lib/auth/provider';
import { authPrefix } from 'lib/i18n/language';
import text from 'lib/i18n/localize';
import { is } from '@toba/tools';

interface Props {
   title?: string;
   providers: AuthLink[];
}

/**
 * Component to display sign-in links for all given providers.
 */
export default (props: Props) => {
   let title = props.title;
   if (is.empty(title)) {
      title = text.SIGN_IN_TO_CONTINUE;
   }

   return (
      <div className="sign-in">
         <h1>{title}</h1>
         <div className="providers">
            {props.providers.map(p => (
               <a href={p.url} className={p.key}>
                  <SVG
                     src={'/img/auth-provider/' + p.key + '.svg'}
                     className={p.key}
                  />
                  {text[authPrefix + p.key]}
               </a>
            ))}
         </div>
      </div>
   );
};
