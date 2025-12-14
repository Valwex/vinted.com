import { isElement } from "./utilities-iselement.js";
import { getIntersection } from "./utilities-data.js";
import { sanitizeRoot } from "./utilities-options.js";
/**
 * Check whether element is matched uniquely by selector.
 */
export function testSelector(elements, selector, root) {
    const result = Array.from(sanitizeRoot(root, elements[0]).querySelectorAll(selector));
    return (result.length === elements.length &&
        elements.every((element) => result.includes(element)));
}
/**
 * Test whether selector targets element. It does not have to be a unique match.
 */
export function testMultiSelector(element, selector, root) {
    const result = Array.from(sanitizeRoot(root, element).querySelectorAll(selector));
    return result.includes(element);
}
/**
 * Find all parents of a single element.
 */
export function getElementParents(element, root) {
    root = root !== null && root !== void 0 ? root : getRootNode(element);
    const result = [];
    let parent = element;
    while (isElement(parent) && parent !== root) {
        result.push(parent);
        parent = parent.parentElement;
    }
    return result;
}
/**
 * Find all common parents of elements.
 */
export function getParents(elements, root) {
    return getIntersection(elements.map((element) => getElementParents(element, root)));
}
/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 */
export function getRootNode(element) {
    // The `:root` selector always returns a parent node. The `null` return value is not applicable here.
    return element.ownerDocument.querySelector(":root");
}
//# sourceMappingURL=utilities-dom.js.map