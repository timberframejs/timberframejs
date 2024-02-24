import { auHref } from "../../src/plugins/auHref/auHref.js";
import { auElementType, pluginArgs } from "../../src/types.js";

const _window = {
  location:{
    hash:''
  }
}

describe('auHref function', () => {
  let ele
  beforeEach(()=>{
    ele = document.createElement('div')
  })
  it('should return null if tfMeta.auHref is null', async () => {
    const plugIn = { ele };
    const result = await auHref(plugIn, {_window});
    expect(result).toBeNull();
  });

  it('should return the expected hash value if tfMeta.auHref is "use tf-ced"',async () => {
    const tagName = 'example-tag';
    const qs = new URLSearchParams('param=value');
    ele.setAttribute('tf-href','use tf-ced')
    const plugIn = {
      ele,
      tfMeta: {
        auCed: {
          tagName,
          qs,
        },
      },
    } as Partial<pluginArgs>;

    const result = await auHref(plugIn, {_window});
    expect(result).toBe(`#${tagName}?${qs}`);
  });

  it('should return the expected hash value for other values of tfMeta.auHref', async() => {
    const auHrefValue = 'some-hash-value';
    ele.setAttribute('tf-href', auHrefValue)
    const plugIn = { ele } as Partial<pluginArgs>;
    const result = await auHref(plugIn, {_window});
    expect(result).toBe(`${auHrefValue}`);
  });
});
