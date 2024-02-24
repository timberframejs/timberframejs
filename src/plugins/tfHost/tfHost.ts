import { eventSetupArgs } from "../../types.js";

const hostT = ['tf-target', 'tf-include'];

export const tfHostImpl = (esa: eventSetupArgs, piArgs) => {
  const {ele, initialMeta} = esa;
  const tfHost = ele.getAttribute('tf-host');
  if (tfHost !== null && tfHost.length > 1) {
    hostT.forEach(att => {
      if (ele.getAttribute(att) === "host") {
        ele.setAttribute(att, tfHost);
        initialMeta.brains.push(`replaced ${att} with the value from tf-host`);
      }
    })
  }
}