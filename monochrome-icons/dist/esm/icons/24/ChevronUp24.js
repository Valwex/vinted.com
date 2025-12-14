import * as React from 'react';

const ChevronUp24 = ({ title, titleId, ...props }) => /* @__PURE__ */ React.createElement("svg", { fill: "none", viewBox: "0 0 24 24", width: 24, height: 24, "aria-labelledby": titleId, ...props }, title ? /* @__PURE__ */ React.createElement("title", { id: titleId }, title) : null, /* @__PURE__ */ React.createElement(
  "path",
  {
    fill: "currentColor",
    d: "M6.23 14.763a.765.765 0 0 0 1.106 0L12 9.95l4.664 4.813a.765.765 0 0 0 1.107 0 .826.826 0 0 0 0-1.142l-5.218-5.384a.766.766 0 0 0-1.106 0L6.229 13.62a.826.826 0 0 0 0 1.142Z"
  }
));
ChevronUp24.Size = 24;
ChevronUp24.Title = "ChevronUp";

export { ChevronUp24 as default };
