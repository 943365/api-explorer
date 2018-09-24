const React = require('react');
const ReactDOM = require('react-dom');

function Doc({ doc }) {
  return (
    <li className="hub-sidebar-page subnav-expanded">
      <a className="text-overflow" href={`#${doc.slug}`}>
        <span className={`pg-type type-${doc.api.method}`}>{doc.api.method}</span>
        {doc.title}
      </a>
    </li>
  );
}

function Sidebar({ title, docs }) {
  return ReactDOM.createPortal((
    <div className="hub-sidebar-category">
      <h3>{title}</h3>
      <ul>
        { docs.map(doc => <Doc key={doc._id} doc={doc} />) }
      </ul>
    </div>
  ), document.getElementById('hub-sidebar-content'));
}

module.exports = Sidebar;
