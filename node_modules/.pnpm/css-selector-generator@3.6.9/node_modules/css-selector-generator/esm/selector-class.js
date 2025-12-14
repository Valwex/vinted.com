import { sanitizeSelectorItem } from "./utilities-selectors.js";
import { INVALID_CLASS_RE } from "./constants.js";
import { getIntersection } from "./utilities-data.js";
/**
 * Get class selectors for an element.
 */
export function getElementClassSelectors(element) {
    var _a;
    return ((_a = element.getAttribute("class")) !== null && _a !== void 0 ? _a : "")
        .trim()
        .split(/\s+/)
        .filter((item) => !INVALID_CLASS_RE.test(item))
        .map((item) => `.${sanitizeSelectorItem(item)}`);
}
/**
 * Get class selectors matching all elements.
 */
export function getClassSelectors(elements) {
    const elementSelectors = elements.map(getElementClassSelectors);
    return getIntersection(elementSelectors);
}
//# sourceMappingURL=selector-class.js.map