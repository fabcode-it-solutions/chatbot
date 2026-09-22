export const checkIsCancelled = (message) => {
  const decisionMatch = message.match(
    /<!--\s*<decision>(.*?)<\/decision>\s*-->/i
  );
  const decision = decisionMatch?.[1]?.toLowerCase() || "retain";
  return decision === "cancel";
};

export const checkOrderIds = (message) => {
  const decisionMatch = message.match(
    /<!--\s*<orderData>(.*?)<\/orderData>\s*-->/i
  );
  return JSON.parse(decisionMatch?.[1] || false);
};

export const checkAdditionalInfo = (message, key) => {
  const decisionMatch = message.match(
    /<!--\s*<additionalInfo>(.*?)<\/additionalInfo>\s*-->/i
  );
  const decision = decisionMatch?.[1]?.toLowerCase() || "retain";
  return decision === key;
};

export const checkAddToCart = (message) => {
  const decisionMatch = message.match(
    /<!--\s*<purchase>(.*?)<\/purchase>\s*-->/i
  );
  const decision = decisionMatch?.[1]?.toLowerCase();
  return decision;
};

export const addToCart = (message) => {
  const data = JSON.parse(checkAddToCart(message));
  window.parent.postMessage(
    {
      action: "selectedVariant",
      variantid: data.variantid,
      quantity: data.quantity,
    },
    "*"
  );
};

export const checkCheckout = (message) => {
  const decisionMatch = message.match(
    /<!--\s*<buttonIdentifier>(checkout)<\/buttonIdentifier>\s*-->/i
  );
  const decision = decisionMatch?.[1]?.toLowerCase();

  return decision;
};

export const checkProducts = (message) => {
  const decisionMatch = message.match(
    /<!--\s*<productSuggestion>(.*?)<\/productSuggestion>\s*-->/i
  );
  const decision = decisionMatch?.[1];
  if (decision) {
    return JSON.parse(decision);
  } else {
    return false;
  }
};
export const checkButton = (message, key) => {
  const decisionMatch = message.match(
    /<!--\s*<buttonIdentifier>(confirmEmail)<\/buttonIdentifier>\s*-->/i
  );

  const decision = decisionMatch?.[1]?.toLowerCase();

  return decision;
};

export const checkArray = (message) => {
  const decisionMatch = message.match(/<!--\s*<array>(.*?)<\/array>\s*-->/i);
  const decision = decisionMatch?.[1];

  if (decision) {
    return JSON.parse(decision);
  } else {
    return false;
  }
};
