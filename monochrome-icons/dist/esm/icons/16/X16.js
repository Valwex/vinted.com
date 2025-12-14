import * as React from 'react';

const X16 = ({ title, titleId, ...props }) => /* @__PURE__ */ React.createElement("svg", { fill: "none", viewBox: "0 0 16 16", width: 16, height: 16, "aria-labelledby": titleId, ...props }, title ? /* @__PURE__ */ React.createElement("title", { id: titleId }, title) : null, /* @__PURE__ */ React.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M14.03 3.03a.75.75 0 0 0-1.06-1.06L8 6.94 3.03 1.97a.75.75 0 0 0-1.06 1.06L6.94 8l-4.97 4.97a.75.75 0 1 0 1.06 1.06L8 9.06l4.97 4.97a.75.75 0 1 0 1.06-1.06L9.06 8z",
    clipRule: "evenodd"
  }
));
X16.Size = 16;
X16.Title = "X";

export { X16 as default };
