import * as React from 'react';

const ChevronDown24 = ({ title, titleId, ...props }) => /* @__PURE__ */ React.createElement("svg", { fill: "none", viewBox: "0 0 24 24", width: 24, height: 24, "aria-labelledby": titleId, ...props }, title ? /* @__PURE__ */ React.createElement("title", { id: titleId }, title) : null, /* @__PURE__ */ React.createElement(
  "path",
  {
    fill: "currentColor",
    d: "M6.23 8.237a.766.766 0 0 1 1.106 0L12 13.05l4.664-4.813a.766.766 0 0 1 1.107 0 .826.826 0 0 1 0 1.142l-5.218 5.384a.765.765 0 0 1-1.106 0L6.229 9.38a.826.826 0 0 1 0-1.142Z"
  }
));
ChevronDown24.Size = 24;
ChevronDown24.Title = "ChevronDown";

export { ChevronDown24 as default };
