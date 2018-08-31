const React = require('react');
const PropTypes = require('prop-types');
const syntaxHighlighter = require('@readme/syntax-highlighter');

let ReactJson;

class Authorized extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { renderResponse: false };
  }
  componentDidMount() {
    ReactJson = require('react-json-view').default;
    this.setState({ renderResponse: true });
  }
  render() {
    const { result } = this.props;

    const isJson = result.type && result.type.includes('application/json');
    return (
      <div>
        {result.isBinary && <div>A binary file was returned</div>}
        {!result.isBinary &&
        isJson && (
          <ReactJson
            src={result.responseBody}
            collapsed={1}
            collapseStringsAfterLength={100}
            enableClipboard={false}
            theme="tomorrow"
            name={null}
            displayDataTypes={false}
            displayObjectSize={false}
            style={{
              padding: '20px 10px',
              backgroundColor: 'transparent',
              fontSize: '12px',
            }}
          />
        )}
        {!result.isBinary &&
        !isJson && (
          <pre className="tomorrow-night">
            <div
              className="cm-s-tomorrow-night codemirror-highlight"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: syntaxHighlighter(result.responseBody, result.type),
              }}
            />
          </pre>
        )}
      </div>
    );
  }
}

Authorized.propTypes = {
  result: PropTypes.shape({}).isRequired,
};

function hasOauth(oauth) {
  if (!oauth) return <p>Your OAuth2 token is incorrect or has expired</p>;

  return (
    <div>
      <p>Your OAuth2 token has expired</p>
      <a className="btn btn-primary" href={oauthHref()} target="_self">
        Reauthenticate via OAuth2
      </a>
    </div>
  );
}

function Unauthorized({ isOauth, oauth }) {
  return (
    <div className="text-center hub-expired-token">
      {isOauth ? hasOauth(oauth) : <p>You couldn&apos;t be authenticated</p>}
    </div>
  );
}

Unauthorized.propTypes = {
  isOauth: PropTypes.bool,
  oauth: PropTypes.bool.isRequired,
};

Unauthorized.defaultProps = {
  isOauth: false,
};

function ResponseBody({ result, isOauth, oauth }) {
  return (
    <div className="tabber-body tabber-body-result" style={{ display: 'block' }}>
      {result.status !== 401 && <Authorized result={result} />}
      {result.status === 401 && <Unauthorized isOauth={isOauth} oauth={oauth} />}
    </div>
  );
}

module.exports = ResponseBody;

ResponseBody.propTypes = Object.assign({}, Unauthorized.propTypes, Authorized.propTypes);

ResponseBody.defaultProps = Unauthorized.defaultProps;
