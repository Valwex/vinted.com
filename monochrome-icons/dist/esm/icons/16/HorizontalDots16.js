import * as React from 'react';

const HorizontalDots16 = ({ title, titleId, ...props }) => /* @__PURE__ */ React.createElement("svg", { fill: "none", viewBox: "0 0 16 16", width: 16, height: 16, "aria-labelledby": titleId, ...props }, title ? /* @__PURE__ */ React.createElement("title", { id: titleId }, title) : null, /* @__PURE__ */ React.createElement(
  "path",
  {
    fill: "currentColor",
    d: "M4 8a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 4 8m11 0a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 15 8M8 9.5a1.5 1.5 0 1 0-.001-3.001A1.5 1.5 0 0 0 8 9.5"
  }
));
HorizontalDots16.Size = 16;
HorizontalDots16.Title = "HorizontalDots";

export { HorizontalDots16 as default };
