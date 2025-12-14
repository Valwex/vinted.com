/**
 * Generates cartesian product out of input object.
 */
export function getCartesianProduct(input = {}) {
    let result = [];
    Object.entries(input).forEach(([key, values]) => {
        result = values.flatMap((value) => {
            if (result.length === 0) {
                return [{ [key]: value }];
            }
            else {
                return result.map((memo) => (Object.assign(Object.assign({}, memo), { [key]: value })));
            }
        });
    });
    return result;
}
//# sourceMappingURL=utilities-cartesian.js.map