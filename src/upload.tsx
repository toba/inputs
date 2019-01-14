import './file-upload.scss';
import * as React from 'react';
import Icon from './icon';
import text from 'lib/i18n/localize';

interface Props {
   allowMultiple?: boolean;
   maxSize?: number;
   allowMimeTypes?: string[];
   onClick?: () => void;
}

enum Status {
   Ready,
   Uploading,
   Error
}

interface State {
   hover: boolean;
   error: boolean;
   status: Status;
}

/**
 * https://css-tricks.com/drag-and-drop-file-uploading/
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */
export default class extends React.PureComponent<Props, State> {
   constructor(props: Props) {
      super(props);

      if (props.allowMultiple === undefined) {
         props.allowMultiple = false;
      }
      this.state = {
         hover: false,
         error: false,
         status: Status.Ready
      };
   }

   onDrop(e: DragEvent) {
      e.preventDefault();

      const tx = e.dataTransfer;
      if (tx.items) {
         for (let i = 0; i < tx.items.length; i++) {
            if (tx.items[i].kind == 'file') {
               const f = tx.items[i].getAsFile();
               console.log(f);
            }
         }
      } else {
         for (let i = 0; i < tx.files.length; i++) {
            const f = tx.files[i];
            console.log(f);
         }
      }
      this.setState({ hover: false });
   }

   onDragEnter() {
      this.setState({ hover: true });
   }
   onDragLeave() {
      this.setState({ hover: false });
   }
   /**
    * onDragOver is required to prevent the browser itself from trying to open
    * the file.
    */
   onDragOver(e: DragEvent) {
      this.setState({ hover: true });
      e.preventDefault();
   }

   shouldComponentUpdate(_nextProps: Props, nextState: State) {
      return nextState.hover != this.state.hover;
   }

   render() {
      const css = 'file-upload' + (this.state.hover ? ' active' : '');
      //const say = this.props.allowMultiple ? text.DRAG_FILES_HERE : text.DRAG_ONE_FILE_HERE;
      return (
         <div
            className={css}
            onDrop={this.onDrop.bind(this)}
            onDragOver={this.onDragOver.bind(this)}
            onDragEnter={this.onDragEnter.bind(this)}
            onDragLeave={this.onDragLeave.bind(this)}
         >
            <form method="post" encType="multipart/form-data">
               <input
                  type="file"
                  id="file"
                  name="files[]"
                  multiple={this.props.allowMultiple}
               />
               <label htmlFor="file">Choose a file</label>
               <span>
                  <Icon name="file_upload" />
                  or drag it here
               </span>
            </form>
            <div className="uploading">Uploading&hellip;</div>
            <div className="success">Done!</div>
            <div className="error">Error!</div>
         </div>
      );
   }
}
