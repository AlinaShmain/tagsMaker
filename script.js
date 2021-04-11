import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM готов!");

  const curry = (f) => {
    const nargs = f.length;
    const vargs = [];

    const curried = (...args) => {
      return vargs.push(...args) >= nargs
        ? f(...vargs.slice(0, nargs))
        : curried;
    };

    return curried;
  };

  let numBlock = 0;

  const deleteBtn = (e) => {
    let block = e.currentTarget.parentNode;
    const num = parseInt(block.getAttribute("data-number"), 10);

    let nextBlock = document.querySelector(`div[data-number="${num + 1}"]`);
    if (nextBlock) {
      [...document.getElementsByClassName("block")]
        .slice(num)
        .forEach((block) => {
          let number = block.getAttribute("data-number");
          console.log(number);
          block.firstChild.innerHTML = `${--number} block`;
          block.setAttribute("data-number", number);
        });
      numBlock--;
    }
    
    block.remove();
  };

  const createElement = (options) => {
    let element = document.createElement(options.tag);

    if (options.classes) {
      element.classList = options.classes;
    }
    if (options.attributeName && options.attributeVal) {
      element.setAttribute(options.attributeName, options.attributeVal);
    }
    if (options.text) {
      element.innerHTML = options.text;
    }

    return element;
  };

  const makeBlock = (a, b, c) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    c = parseInt(c, 10);

    numBlock++;

    const parentNode = createElement({
      tag: a,
      classes: "block",
      attributeName: "data-number",
      attributeVal: numBlock,
    });

    let name = createElement({
      tag: "span",
      classes: "name__block",
      text: `${numBlock} block ${a}`,
    });
    parentNode.append(name);

    const deleteButton = createElement({
      tag: "button",
      classes: "button-delete",
    });
    const icon = createElement({
      tag: "i",
      classes: "fas fa-times button-delete__icon",
    });
    deleteButton.append(icon);
    deleteButton.addEventListener("click", deleteBtn);

    let childNodes = new Array(c);
    for (let i = 0; i < childNodes.length; i++) {
      childNodes[i] = createElement({
        tag: b,
        classes: "child__block",
        text: `${i + 1} ${b}`,
      });
    }

    let container = document.getElementsByClassName("container-blocks")[0];
    container.append(parentNode);
    parentNode.append(deleteButton);
    childNodes.forEach((node) => parentNode.append(node));
  };

  const isEmpty = (str) => {
    return !str || str.length === 0 || !str.trim();
  };

  const getElementDefaultDisplay = (element) => {
    const gcs = "getComputedStyle" in window;

    document.body.appendChild(element);
    let cStyle = (gcs ? window.getComputedStyle(element, "") : element.currentStyle)
      .display;
    document.body.removeChild(element);

    return cStyle;
  };

  const validateForm = (parent, child, count) => {
    let status = document.getElementsByClassName("status")[0];
    status.innerHTML = "";
    status.style.display = "none";
    let errorParent = document.getElementsByClassName("error parent")[0];
    let errorChild = document.getElementsByClassName("error child")[0];
    let errorCount = document.getElementsByClassName("error count")[0];
    errorParent.innerHTML = "";
    errorChild.innerHTML = "";
    errorCount.innerHTML = "";

    if (isEmpty(parent) || isEmpty(child) || isEmpty(count)) {
      if (isEmpty(parent)) {
        errorParent.innerHTML = "empty field";
      }
      if (isEmpty(child)) {
        errorChild.innerHTML = "empty field";
      }
      if (isEmpty(count)) {
        errorCount.innerHTML = "empty field";
      }
      return false;
    }

    parent = parent.toLowerCase();
    child = child.toLowerCase();

    let parentNode = document.createElement(parent);
    let childNode = document.createElement(child);

    if (parentNode instanceof HTMLUnknownElement) {
      errorParent.innerHTML = "entered value is not HTML tag";
      return false;
    }
    if (childNode instanceof HTMLUnknownElement) {
      errorChild.innerHTML = "entered value is not HTML tag";
      return false;
    }

    if (
      getElementDefaultDisplay(parentNode) === "inline" &&
      getElementDefaultDisplay(childNode) === "block"
    ) {
      status.style.display = "block";
      status.innerHTML =
        "block element cannot be nested inside the inline element";
      return false;
    }

    count = parseInt(count, 10);

    if (isNaN(count)) {
      errorCount.innerHTML = "entered value is not a number";
      return false;
    }
    if (count > 5) {
      errorCount.innerHTML = "the maximum number of children is 5";
      return false;
    }
    if (count < 0) {
      errorCount.innerHTML = "entered number cannot be negative";
      return false;
    }

    return true;
  };

  const createBtn = (e) => {
    e.preventDefault();

    const parentNodeTag = document.getElementById("input-parent-node");
    const childNodeTag = document.getElementById("input-child-node");
    const countChildNodes = document.getElementById("input-count-child-nodes");

    const isValidForm = validateForm(
      parentNodeTag.value,
      childNodeTag.value,
      countChildNodes.value
    );

    if (isValidForm) {
      const makeBlockCurry = curry(makeBlock);
      makeBlockCurry(parentNodeTag.value)(childNodeTag.value)(
        countChildNodes.value
      );
    }
  };

  document
    .getElementsByClassName("button-create")[0]
    .addEventListener("click", createBtn);
});
