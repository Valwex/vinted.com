import { getTagSelector } from "./selector-tag.js";
import { getIntersection } from "./utilities-data.js";
/**
 * Get nth-of-type selector for an element.
 */
export function getElementNthOfTypeSelector(element) {
    const tag = getTagSelector([element])[0];
    const parentElement = element.parentElement;
    if (parentElement) {
        const siblings = Array.from(parentElement.children).filter((element) => element.tagName.toLowerCase() === tag);
        const elementIndex = siblings.indexOf(element);
        if (elementIndex > -1) {
            return [
                `${tag}:nth-of-type(${String(elementIndex + 1)})`,
            ];
        }
    }
    return [];
}
/**
 * Get Nth-of-type selector matching all elements.
 */
export function getNthOfTypeSelector(elements) {
    return getIntersection(elements.map(getElementNthOfTypeSelector));
}
//# sourceMappingURL=selector-nth-of-type.js.map