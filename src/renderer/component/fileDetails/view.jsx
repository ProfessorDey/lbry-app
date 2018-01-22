import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Lbry } from 'lbry-redux';
import FileActions from 'component/fileActions';
import Link from 'component/link';

// eslint-disable-next-line import/no-commonjs
const path = require('path');

class FileDetails extends React.PureComponent {
  render() {
    // eslint-disable-next-line react/prop-types
    const { claim, contentType, fileInfo, metadata, openFolder, uri } = this.props;

    if (!claim || !metadata) {
      return (
        <div className="card__content">
          <span className="empty">{__('Empty claim or metadata info.')}</span>
        </div>
      );
    }

    const { description, language, license } = metadata;
    const mediaType = Lbry.getMediaType(contentType);

    const downloadPath = fileInfo ? path.normalize(fileInfo.download_path) : null;

    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (
      <div>
        <div className="divider__horizontal" />
        <FileActions uri={uri} />
        <div className="divider__horizontal" />
        <div className="card__content card__subtext card__subtext--allow-newlines">
          <ReactMarkdown
            source={description || ''}
            escapeHtml
            disallowedTypes={['Heading', 'HtmlInline', 'HtmlBlock']}
          />
        </div>
        <div className="card__content">
          <table className="table-standard table-stretch">
            <tbody>
              <tr>
                <td>{__('Content-Type')}</td>
                <td>{mediaType}</td>
              </tr>
              <tr>
                <td>{__('Language')}</td>
                <td>{language}</td>
              </tr>
              <tr>
                <td>{__('License')}</td>
                <td>{license}</td>
              </tr>
              {downloadPath && (
                <tr>
                  <td>{__('Downloaded to')}</td>
                  <td>
                    <Link onClick={() => openFolder(downloadPath)}>{downloadPath}</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default FileDetails;
