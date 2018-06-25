const WILDCARD = "*";
const VALUE_KEY = "!";
var exceptionRuleFlag = false;
var bestIndex = 0;

function getBaseDomain(domain) {
    exceptionRuleFlag = false;
    let domainArray = domain.split(".");
    bestIndex = domainArray.length-1;
    traverse(PSL_TREE, domainArray.length-1, domainArray);
    return domainArray.slice(bestIndex, domainArray.length).join(".");
}

function traverse(tree, index, domainArray) {
    if(tree[VALUE_KEY] === 1){
        bestIndex = Math.min(bestIndex, index);
    }
    else if(tree[VALUE_KEY] === 2) {
        bestIndex = index + 1;
        exceptionRuleFlag = true;
        return;
    }
    if(index >= 0) {
        let label = domainArray[index];
        if (!exceptionRuleFlag && tree[label]) {
            traverse(tree[label], index - 1, domainArray);
        }
        if (!exceptionRuleFlag && tree[WILDCARD] && label !== WILDCARD) {
            traverse(tree[WILDCARD], index - 1, domainArray);
        }
    }
}